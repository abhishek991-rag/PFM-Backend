// server/models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Kis user ka kharch hai
        required: true,
        ref: 'User', // User model se refer karega
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
        min: [0.01, 'Amount must be greater than 0'], // Amount positive hona chahiye
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [ // Predefined categories (aap inhein badal sakte hain)
            'Food', 'Transport', 'Utilities', 'Rent', 'Entertainment',
            'Groceries', 'Shopping', 'Healthcare', 'Education', 'Salary',
            'Bills', 'Travel', 'Others'
        ],
        default: 'Others',
    },
    description: {
        type: String,
        trim: true, // Leading/trailing spaces remove karein
        maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
        default: Date.now,
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurringFrequency: { // Agar isRecurring true ho toh (e.g., 'monthly', 'weekly', 'yearly')
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly', null],
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Expense', expenseSchema);