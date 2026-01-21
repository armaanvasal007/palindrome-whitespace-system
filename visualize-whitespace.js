#!/usr/bin/env node

/**
 * Whitespace Code Visualizer for Presentations
 * Makes invisible Whitespace characters visible for demonstration
 */

const fs = require('fs');
const path = require('path');

class WhitespaceVisualizer {
    constructor() {
        this.symbols = {
            ' ': '·',    // Space → Middle dot
            '\t': '→',   // Tab → Right arrow  
            '\n': '↵\n', // Line feed → Return symbol + actual newline
        };
    }

    // Convert Whitespace to visible symbols
    visualize(code) {
        return code.split('').map(char => {
            return this.symbols[char] || char;
        }).join('');
    }

    // Analyze code structure
    analyze(code) {
        const stats = {
            spaces: (code.match(/ /g) || []).length,
            tabs: (code.match(/\t/g) || []).length,
            linefeeds: (code.match(/\n/g) || []).length,
            total: code.length,
            instructions: []
        };

        // Parse instructions (simplified)
        const lines = code.split('\n');
        lines.forEach((line, index) => {
            if (line.trim().length > 0) {
                const instruction = this.parseInstruction(line);
                if (instruction) {
                    stats.instructions.push({
                        line: index + 1,
                        pattern: this.visualize(line),
                        instruction: instruction
                    });
                }
            }
        });

        return stats;
    }

    // Parse Whitespace instruction (basic patterns)
    parseInstruction(line) {
        const pattern = line.replace(/ /g, 'S').replace(/\t/g, 'T');
        
        const instructions = {
            'SS': 'Push number to stack',
            'SLS': 'Duplicate top of stack',
            'SLL': 'Discard top of stack',
            'TLTS': 'Read number from input',
            'TLSS': 'Output number',
            'TLST': 'Output character',
            'TLTT': 'Read character',
            'TSSS': 'Addition',
            'TSST': 'Subtraction', 
            'TSSL': 'Multiplication',
            'TSTS': 'Division',
            'TSTT': 'Modulo',
            'LSS': 'Mark label',
            'LST': 'Call subroutine',
            'LSL': 'Jump unconditionally',
            'LTS': 'Jump if zero',
            'LTT': 'Jump if negative',
            'LTL': 'Return from subroutine',
            'LLL': 'End program'
        };

        // Find matching instruction
        for (const [key, desc] of Object.entries(instructions)) {
            if (pattern.startsWith(key)) {
                return desc;
            }
        }

        return 'Unknown instruction';
    }

    // Generate presentation-ready output
    generatePresentation(filePath) {
        try {
            const code = fs.readFileSync(filePath, 'utf8');
            const stats = this.analyze(code);
            const visualized = this.visualize(code);

            console.log('🎯 WHITESPACE CODE VISUALIZATION FOR PRESENTATION\n');
            console.log('📊 STATISTICS:');
            console.log(`   Total Characters: ${stats.total}`);
            console.log(`   Spaces: ${stats.spaces}`);
            console.log(`   Tabs: ${stats.tabs}`);
            console.log(`   Line Feeds: ${stats.linefeeds}\n`);

            console.log('👁️  VISUALIZED CODE:');
            console.log('   Legend: · = Space, → = Tab, ↵ = Line Feed\n');
            console.log('┌' + '─'.repeat(50) + '┐');
            console.log('│' + ' '.repeat(18) + 'WHITESPACE CODE' + ' '.repeat(17) + '│');
            console.log('├' + '─'.repeat(50) + '┤');
            
            const lines = visualized.split('\n');
            lines.forEach((line, index) => {
                if (line.length > 0) {
                    const truncated = line.length > 46 ? line.substring(0, 43) + '...' : line;
                    console.log(`│ ${truncated.padEnd(48)} │`);
                }
            });
            
            console.log('└' + '─'.repeat(50) + '┘\n');

            console.log('🔍 INSTRUCTION BREAKDOWN:');
            if (stats.instructions.length > 0) {
                stats.instructions.forEach((inst, index) => {
                    console.log(`   ${index + 1}. Line ${inst.line}: ${inst.instruction}`);
                    console.log(`      Pattern: ${inst.pattern}`);
                });
            } else {
                console.log('   No clear instructions detected (may be encoded differently)');
            }

            console.log('\n🎨 PRESENTATION TIPS:');
            console.log('   1. Show the raw file first (appears empty)');
            console.log('   2. Reveal this visualization to show hidden structure');
            console.log('   3. Explain each symbol type (space, tab, line feed)');
            console.log('   4. Walk through the instruction meanings');
            console.log('   5. Demonstrate live execution\n');

            return {
                visualized,
                stats,
                success: true
            };

        } catch (error) {
            console.error('❌ Error reading Whitespace file:', error.message);
            return { success: false, error: error.message };
        }
    }
}

// CLI usage
if (require.main === module) {
    const visualizer = new WhitespaceVisualizer();
    const filePath = process.argv[2] || 'core/palindrome.ws';
    
    console.log(`🔍 Analyzing Whitespace file: ${filePath}\n`);
    visualizer.generatePresentation(filePath);
}

module.exports = WhitespaceVisualizer;