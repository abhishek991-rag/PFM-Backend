// server/controllers/expenseController.js
const Expense = require('../models/Expense');
const User = require('../models/User'); // Agar user details ki zaroorat pade future mein

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private
const addExpense = async (req, res) => {
    const { amount, category, description, date, isRecurring, recurringFrequency } = req.body;

    // Validation
    if (!amount || !category || !date) {
        return res.status(400).json({ message: 'Please include amount, category, and date' });
    }

    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    try {
        // Req.user comes from the protect middleware (user ID)
        const expense = await Expense.create({
            user: req.user.id, // Authenticated user ki ID
            amount,
            category,
            description,
            date,
            isRecurring,
            recurringFrequency: isRecurring ? recurringFrequency : null, // Frequency only if recurring
        });

        res.status(201).json({
            message: 'Expense added successfully',
            expense,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
    try {
        // Find all expenses for the authenticated user, sorted by date (newest first)
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1, createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json(expense);
    } catch (error) {
        console.error(error);
        // Agar ID invalid format mein ho (e.g., not a valid ObjectId)
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid expense ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
    const { amount, category, description, date, isRecurring, recurringFrequency } = req.body;

    try {
        let expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Update fields
        expense.amount = amount || expense.amount;
        expense.category = category || expense.category;
        expense.description = description !== undefined ? description : expense.description;
        expense.date = date || expense.date;
        expense.isRecurring = isRecurring !== undefined ? isRecurring : expense.isRecurring;
        expense.recurringFrequency = isRecurring ? recurringFrequency || expense.recurringFrequency : null;


        await expense.save(); // Save the updated expense

        res.status(200).json({
            message: 'Expense updated successfully',
            expense,
        });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid expense ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        await expense.deleteOne(); // Use deleteOne() for Mongoose 6+

        res.status(200).json({ message: 'Expense removed successfully' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid expense ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
};