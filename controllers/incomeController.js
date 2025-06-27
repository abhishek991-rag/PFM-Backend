// server/controllers/incomeController.js
const Income = require('../models/Income');

// @desc    Add new income
// @route   POST /api/income
// @access  Private
const addIncome = async (req, res) => {
    const { amount, source, date, description, isRecurring, recurringFrequency } = req.body;

    // Validation
    if (!amount || !source || !date) {
        return res.status(400).json({ message: 'Please include amount, source, and date' });
    }
    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    try {
        const income = await Income.create({
            user: req.user.id, // Authenticated user's ID
            amount,
            source,
            date,
            description,
            isRecurring,
            recurringFrequency: isRecurring ? recurringFrequency : null,
        });

        res.status(201).json({
            message: 'Income added successfully',
            income,
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all income for a user
// @route   GET /api/income
// @access  Private
const getIncomes = async (req, res) => {
    try {
        // Find all income for the authenticated user, sorted by date (newest first)
        const incomes = await Income.find({ user: req.user.id }).sort({ date: -1, createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single income by ID
// @route   GET /api/income/:id
// @access  Private
const getIncomeById = async (req, res) => {
    try {
        const income = await Income.findOne({ _id: req.params.id, user: req.user.id });

        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.status(200).json(income);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid income ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update an income record
// @route   PUT /api/income/:id
// @access  Private
const updateIncome = async (req, res) => {
    const { amount, source, date, description, isRecurring, recurringFrequency } = req.body;

    try {
        let income = await Income.findOne({ _id: req.params.id, user: req.user.id });

        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        // Update fields
        income.amount = amount || income.amount;
        income.source = source || income.source;
        income.date = date || income.date;
        income.description = description !== undefined ? description : income.description;
        income.isRecurring = isRecurring !== undefined ? isRecurring : income.isRecurring;
        income.recurringFrequency = isRecurring ? recurringFrequency || income.recurringFrequency : null;

        await income.save();

        res.status(200).json({
            message: 'Income updated successfully',
            income,
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid income ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete an income record
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = async (req, res) => {
    try {
        const income = await Income.findOne({ _id: req.params.id, user: req.user.id });

        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        await income.deleteOne();

        res.status(200).json({ message: 'Income removed successfully' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid income ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addIncome,
    getIncomes,
    getIncomeById,
    updateIncome,
    deleteIncome,
};