const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// Create new account route
router.post('/accounts', async (req, res) => {
    try {
        const { branch, location, address, accountNumber } = req.body;
        
        // Create new account
        const newAccount = new Account({
            branch,
            location,
            address,
            accountNumber
        });

        // Save the account
        await newAccount.save();

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: newAccount
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const formattedErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));

            return res.status(400).json({
                success: false,
                errors: formattedErrors
            });
        }

        // Handle duplicate key error (for unique account number)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                errors: [{
                    field: 'accountNumber',
                    message: 'Account number already exists'
                }]
            });
        }

        // Handle other errors
        res.status(500).json({
            success: false,
            message: 'Error creating account',
            error: error.message
        });
    }
});

module.exports = router; 