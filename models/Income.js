// server/models/Income.js
const mongoose = require('mongoose');

const incomeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // References the User model
    },
    amount: {
        type: Number,
        required: [true, 'Please add an income amount'],
        min: [0.01, 'Income amount must be greater than 0'],
    },
    source: { // e.g., 'Salary', 'Freelance', 'Investment', 'Gift'
        type: String,
        required: [true, 'Please specify the income source'],
        trim: true,
        maxlength: [100, 'Source cannot be more than 100 characters'],
    },
    date: {
        type: Date,
        required: [true, 'Please add the date of income'],
        default: Date.now,
    },
    description: { // Optional description for the income
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    isRecurring: { // To mark if this is a recurring income
        type: Boolean,
        default: false,
    },
    recurringFrequency: { // If recurring, how often? (e.g., 'monthly', 'weekly')
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly', null],
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Income', incomeSchema);