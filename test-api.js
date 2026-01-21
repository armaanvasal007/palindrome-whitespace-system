// Simple test script for the Palindrome API
const testCases = [
    { input: 121, expected: true, description: "Basic palindrome" },
    { input: 123, expected: false, description: "Not a palindrome" },
    { input: 7, expected: true, description: "Single digit" },
    { input: -121, expected: false, description: "Negative number" },
    { input: 12321, expected: true, description: "Longer palindrome" },
    { input: 1001, expected: true, description: "Palindrome with zeros" }
];

async function testAPI() {
    console.log('🧪 Testing Palindrome API...\n');
    
    for (const testCase of testCases) {
        try {
            const response = await fetch('http://localhost:3001/api/check-palindrome', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ number: testCase.input })
            });
            
            const result = await response.json();
            const passed = result.isPalindrome === testCase.expected;
            
            console.log(`${passed ? '✅' : '❌'} ${testCase.description}`);
            console.log(`   Input: ${testCase.input}`);
            console.log(`   Expected: ${testCase.expected}, Got: ${result.isPalindrome}`);
            console.log(`   Whitespace Output: ${result.whitespaceOutput}\n`);
            
        } catch (error) {
            console.log(`❌ ${testCase.description} - Error: ${error.message}\n`);
        }
    }
}

// Run tests if this is executed directly
if (typeof window === 'undefined') {
    testAPI().catch(console.error);
}