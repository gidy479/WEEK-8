const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Validation rules for user creation
const userValidationRules = [
    // Name validation
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),

    // Phone number validation
    body('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required')
        .trim()
        .matches(/^(\+234|0)[0-9]{10}$|^(\+233|0)[0-9]{9}$/)
        .withMessage('Invalid phone number format. Must be a valid Nigeria (+234/0) or Ghana (+233/0) number')
        .custom(async (value) => {
            const existingUser = await User.findOne({ phoneNumber: value });
            if (existingUser) {
                throw new Error('Phone number already exists');
            }
            return true;
        }),

    // Account number validation
    body('accountNumber')
        .notEmpty()
        .withMessage('Account number is required')
        .trim()
        .custom(async (value) => {
            const existingUser = await User.findOne({ accountNumber: value });
            if (existingUser) {
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
    userValidationRules,
    validate
}; 