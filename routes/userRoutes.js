const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { userValidationRules, validate } = require('../validators/userValidator');

// Create new user route with validation
router.post('/users', userValidationRules, validate, async (req, res) => {
    try {
        const { name, phoneNumber, accountNumber } = req.body;
        
        // Create new user
        const newUser = new User({
            name,
            phoneNumber,
            accountNumber
        });

        // Save the user
        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        // Handle other unexpected errors
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

module.exports = router; 