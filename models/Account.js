const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    branch: {
        type: String,
        required: [true, 'Branch is required'],
        trim: true,
        minlength: [2, 'Branch name must be at least 2 characters long']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        minlength: [2, 'Location must be at least 2 characters long']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minlength: [5, 'Address must be at least 5 characters long']
    },
    accountNumber: {
        type: String,
        required: [true, 'Account number is required'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid account number! Must be exactly 10 digits.`
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the model
module.exports = mongoose.model('Account', accountSchema); 