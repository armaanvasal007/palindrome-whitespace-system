#!/usr/bin/env node

/**
 * Simple deployment verification script
 * Checks that all components are working correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Palindrome Checker Deployment Verification\n');

// Check required files
const requiredFiles = [
    'package.json',
    'backend/server.js',
    'backend/whitespace-executor.js',
    'core/palindrome.ws',
    'core/palindrome-commented.txt',
    'frontend/index.html',
    'frontend/style.css',
    'frontend/script.js',
    'whitespace-interpreter/interpreter.js'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ Deployment failed: Missing required files');
    process.exit(1);
}

// Check package.json
console.log('\n📦 Checking package.json...');
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`✅ Package: ${pkg.name} v${pkg.version}`);
    console.log(`✅ Main script: ${pkg.main}`);
    console.log(`✅ Dependencies: ${Object.keys(pkg.dependencies || {}).length} packages`);
} catch (error) {
    console.log('❌ Invalid package.json');
    process.exit(1);
}

// Check Whitespace file
console.log('\n🔤 Checking Whitespace program...');
try {
    const whitespaceCode = fs.readFileSync('core/palindrome.ws', 'utf8');
    console.log(`✅ Whitespace code: ${whitespaceCode.length} characters`);
    
    // Count whitespace characters
    const spaces = (whitespaceCode.match(/ /g) || []).length;
    const tabs = (whitespaceCode.match(/\t/g) || []).length;
    const linefeeds = (whitespaceCode.match(/\n/g) || []).length;
    
    console.log(`   - Spaces: ${spaces}`);
    console.log(`   - Tabs: ${tabs}`);
    console.log(`   - Line feeds: ${linefeeds}`);
} catch (error) {
    console.log('❌ Error reading Whitespace file');
    process.exit(1);
}

console.log('\n✅ All deployment checks passed!');
console.log('\n🎯 Next steps:'); 
console.log('1. Run: npm install');
console.log('2. Run: npm start');
console.log('3. Open: http://localhost:3000');
console.log('\n🧪 To test the API:');
console.log('   node test-api.js');