const express = require('express');
const cors = require('cors');
const path = require('path');
const PalindromeChecker = require('./whitespace-executor');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize Whitespace executor
const palindromeChecker = new PalindromeChecker();

// API Routes
app.post('/api/check-palindrome', async (req, res) => {
    try {
        const { number } = req.body;
        
        // Input validation
        if (number === undefined || number === null) {
            return res.status(400).json({
                error: 'Number is required',
                input: number,
                isPalindrome: false
            });
        }

        // Convert to integer for processing
        const inputNumber = parseInt(number);
        
        if (isNaN(inputNumber)) {
            return res.status(400).json({
                error: 'Invalid number format',
                input: number,
                isPalindrome: false
            });
        }

        console.log(`\n--- Palindrome Check Request ---`);
        console.log(`Input: ${inputNumber}`);
        console.log(`Type: ${typeof inputNumber}`);

        // Execute Whitespace program
        const whitespaceResult = await palindromeChecker.executeFromFile(inputNumber);
        const isPalindrome = whitespaceResult === 1;

        console.log(`Whitespace Result: ${whitespaceResult}`);
        console.log(`Is Palindrome: ${isPalindrome}`);
        console.log(`--- End Request ---\n`);

        // Return standardized response
        res.json({
            input: inputNumber,
            isPalindrome: isPalindrome,
            whitespaceOutput: whitespaceResult
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            input: req.body.number,
            isPalindrome: false
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Palindrome Checker API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Palindrome Checker Server running on port ${PORT}`);
    console.log(`📁 Frontend available at: http://localhost:${PORT}`);
    console.log(`🔗 API endpoint: http://localhost:${PORT}/api/check-palindrome`);
    console.log(`💻 Whitespace core logic ready`);
});