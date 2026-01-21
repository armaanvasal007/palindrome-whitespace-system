class WhitespaceInterpreter {
    constructor() {
        this.stack = [];
        this.heap = new Map();
        this.callStack = [];
        this.labels = new Map();
        this.pc = 0; // program counter
        this.input = '';
        this.inputIndex = 0;
        this.output = '';
    }

    // Convert visible characters to Whitespace tokens
    parseProgram(code) {
        const instructions = [];
        let i = 0;
        
        while (i < code.length) {
            const char = code[i];
            if (char === ' ' || char === '\t' || char === '\n') {
                let instruction = '';
                
                // Read instruction
                while (i < code.length && (code[i] === ' ' || code[i] === '\t' || code[i] === '\n')) {
                    instruction += code[i] === ' ' ? 'S' : code[i] === '\t' ? 'T' : 'L';
                    i++;
                }
                
                if (instruction) {
                    instructions.push(instruction);
                }
            } else {
                i++;
            }
        }
        
        return instructions;
    }

    // Parse number from binary representation
    parseNumber(binary) {
        if (!binary) return 0;
        const sign = binary[0] === 'S' ? 1 : -1;
        const magnitude = binary.slice(1).replace(/S/g, '0').replace(/T/g, '1');
        return magnitude ? sign * parseInt(magnitude, 2) : 0;
    }

    // Execute the program
    execute(code, input = '') {
        this.input = input.toString();
        this.inputIndex = 0;
        this.output = '';
        this.stack = [];
        this.heap.clear();
        this.callStack = [];
        this.labels.clear();
        this.pc = 0;

        const instructions = this.parseProgram(code);
        
        // First pass: find labels
        for (let i = 0; i < instructions.length; i++) {
            const inst = instructions[i];
            if (inst.startsWith('LSS')) {
                const labelBinary = inst.slice(3);
                this.labels.set(labelBinary, i);
            }
        }

        // Execute instructions
        while (this.pc < instructions.length) {
            const instruction = instructions[this.pc];
            this.executeInstruction(instruction);
            this.pc++;
        }

        return this.output.trim();
    }

    executeInstruction(instruction) {
        // Stack manipulation
        if (instruction.startsWith('SS')) {
            // Push number
            const numberBinary = instruction.slice(2);
            const number = this.parseNumber(numberBinary);
            this.stack.push(number);
        }
        else if (instruction === 'SLS') {
            // Duplicate top
            if (this.stack.length > 0) {
                this.stack.push(this.stack[this.stack.length - 1]);
            }
        }
        else if (instruction === 'SLL') {
            // Discard top
            this.stack.pop();
        }
        
        // I/O operations
        else if (instruction === 'TLSS') {
            // Output number
            if (this.stack.length > 0) {
                this.output += this.stack.pop().toString();
            }
        }
        else if (instruction === 'TLTS') {
            // Read number
            const num = parseInt(this.input) || 0;
            this.stack.push(num);
        }
        
        // Arithmetic
        else if (instruction === 'TSSS') {
            // Addition
            if (this.stack.length >= 2) {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a + b);
            }
        }
        else if (instruction === 'TSST') {
            // Subtraction
            if (this.stack.length >= 2) {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a - b);
            }
        }
        else if (instruction === 'TSSL') {
            // Multiplication
            if (this.stack.length >= 2) {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a * b);
            }
        }
        else if (instruction === 'TSTS') {
            // Division
            if (this.stack.length >= 2) {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(Math.floor(a / b));
            }
        }
        else if (instruction === 'TSTT') {
            // Modulo
            if (this.stack.length >= 2) {
                const b = this.stack.pop();
                const a = this.stack.pop();
                this.stack.push(a % b);
            }
        }
        
        // Program flow
        else if (instruction === 'LLL') {
            // End program
            this.pc = Infinity;
        }
    }
}

module.exports = WhitespaceInterpreter;