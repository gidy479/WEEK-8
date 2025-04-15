const { body, validationResult } = require('express-validator');
const Account = require('../models/Account');

// Validation rules for account creation
const accountValidationRules = [
    // Branch validation
    body('branch')
        .notEmpty()
        .withMessage('Branch is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Branch name must be at least 2 characters long'),

    // Location validation
    body('location')
        .notEmpty()
        .withMessage('Location is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Location must be at least 2 characters long'),

    // Address validation
    body('address')
        .notEmpty()
        .withMessage('Address is required')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters long'),

    // Account Number validation
    body('accountNumber')
        .notEmpty()
        .withMessage('Account number is required')
        .isNumeric()
        .withMessage('Account number must contain only numbers')
        .isLength({ min: 10, max: 10 })
        .withMessage('Account number must be exactly 10 digits')
        .custom(async (value) => {
            // Check if account number already exists
            const existingAccount = await Account.findOne({ accountNumber: value });
            if (existingAccount) {
                throw new Error('Account number already exists');
            }
            return true;
        })
];

// Middleware to handle validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    
    // Format errors for response
    const formattedErrors = errors.array().map(error => ({
        field: error.path,
        message: error.msg
    }));

    return res.status(400).json({
        success: false,
        errors: formattedErrors
    });
};

module.exports = {
    accountValidationRules,
    validate
}; 