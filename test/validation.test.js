const { body, validationResult } = require('express-validator');
const { userValidationRules } = require('../validators/userValidator');

// Test cases for phone number validation
const testCases = [
    // Valid Nigeria numbers
    {
        name: "John Doe",
        phoneNumber: "+2348123456789",
        accountNumber: "ACC123456",
        expected: "Valid Nigeria number"
    },
    {
        name: "Jane Smith",
        phoneNumber: "+2347012345678",
        accountNumber: "ACC789012",
        expected: "Valid Nigeria number"
    },

    // Valid Ghana numbers
    {
        name: "Kwame Mensah",
        phoneNumber: "+233123456789",
        accountNumber: "ACC345678",
        expected: "Valid Ghana number"
    },
    {
        name: "Ama Boateng",
        phoneNumber: "+233987654321",
        accountNumber: "ACC901234",
        expected: "Valid Ghana number"
    },

    // Invalid numbers
    {
        name: "Test User",
        phoneNumber: "+1234567890",
        accountNumber: "ACC567890",
        expected: "Invalid country code"
    },
    {
        name: "Test User 2",
        phoneNumber: "08123456789",
        accountNumber: "ACC123456",
        expected: "Invalid country code"
    }
];

// Function to test validation
async function testValidation(testCase) {
    const req = {
        body: testCase
    };
    const res = {
        status: () => res,
        json: (data) => data
    };
    const next = () => {};

    // Run validation
    for (const rule of userValidationRules) {
        await rule(req, res, next);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        console.log(`✅ PASS: ${testCase.phoneNumber} - ${testCase.expected}`);
    } else {
        console.log(`❌ FAIL: ${testCase.phoneNumber}`);
        console.log(`   Expected: ${testCase.expected}`);
        console.log(`   Actual: ${errors.array()[0].msg}`);
    }
}

// Run all test cases
console.log("Running validation tests...\n");
testCases.forEach(testCase => {
    testValidation(testCase);
}); 