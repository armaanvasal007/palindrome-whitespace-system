#!/usr/bin/env node

/**
 * Port Conflict Resolution Script
 * Automatically finds and kills processes using our target port
 */

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const TARGET_PORT = 3001;

async function findProcessOnPort(port) {
    try {
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
        const lines = stdout.trim().split('\n');
        
        const processes = [];
        for (const line of lines) {
            const match = line.match(/LISTENING\s+(\d+)/);
            if (match) {
                processes.push(parseInt(match[1]));
            }
        }
        
        return [...new Set(processes)]; // Remove duplicates
    } catch (error) {
        return []; // No processes found
    }
}

async function killProcess(pid) {
    try {
        await execAsync(`taskkill /PID ${pid} /F`);
        return true;
    } catch (error) {
        return false;
    }
}

async function fixPortConflict() {
    console.log(`🔍 Checking for processes using port ${TARGET_PORT}...`);
    
    const processes = await findProcessOnPort(TARGET_PORT);
    
    if (processes.length === 0) {
        console.log(`✅ Port ${TARGET_PORT} is available!`);
        return;
    }
    
    console.log(`⚠️  Found ${processes.length} process(es) using port ${TARGET_PORT}:`);
    processes.forEach(pid => console.log(`   - PID: ${pid}`));
    
    console.log(`🔧 Terminating conflicting processes...`);
    
    for (const pid of processes) {
        const success = await killProcess(pid);
        if (success) {
            console.log(`✅ Terminated process ${pid}`);
        } else {
            console.log(`❌ Failed to terminate process ${pid}`);
        }
    }
    
    // Verify port is now free
    const remainingProcesses = await findProcessOnPort(TARGET_PORT);
    if (remainingProcesses.length === 0) {
        console.log(`🎉 Port ${TARGET_PORT} is now available!`);
        console.log(`🚀 You can now run: npm start`);
    } else {
        console.log(`❌ Some processes are still using port ${TARGET_PORT}`);
        console.log(`   Try running this script as administrator`);
    }
}

if (require.main === module) {
    fixPortConflict().catch(console.error);
}

module.exports = { fixPortConflict, findProcessOnPort, killProcess };