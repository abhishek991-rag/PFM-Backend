// server/controllers/goalController.js
const Goal = require('../models/Goal');

// @desc    Add a new financial goal
// @route   POST /api/goals
// @access  Private
const addGoal = async (req, res) => {
    const { name, targetAmount, targetDate, description } = req.body;

    // Validation
    if (!name || !targetAmount || !targetDate) {
        return res.status(400).json({ message: 'Please provide goal name, target amount, and target date.' });
    }
    if (targetAmount <= 0) {
        return res.status(400).json({ message: 'Target amount must be a positive number.' });
    }

    try {
        const goal = await Goal.create({
            user: req.user.id,
            name,
            targetAmount,
            targetDate,
            description,
        });

        res.status(201).json({
            message: 'Goal added successfully',
            goal,
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all financial goals for a user
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id }).sort({ targetDate: 1 }); // Sorted by target date
        res.status(200).json(goals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single financial goal by ID
// @route   GET /api/goals/:id
// @access  Private
const getGoalById = async (req, res) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.status(200).json(goal);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid goal ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a financial goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
    const { name, targetAmount, savedAmount, targetDate, description, isCompleted } = req.body;

    try {
        let goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // Update fields (only if provided in req.body)
        goal.name = name || goal.name;
        goal.targetAmount = targetAmount || goal.targetAmount;
        goal.savedAmount = savedAmount !== undefined ? savedAmount : goal.savedAmount; // Allow 0
        goal.targetDate = targetDate || goal.targetDate;
        goal.description = description !== undefined ? description : goal.description; // Allow empty string
        goal.isCompleted = isCompleted !== undefined ? isCompleted : goal.isCompleted;

        await goal.save();

        res.status(200).json({
            message: 'Goal updated successfully',
            goal,
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid goal ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a financial goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        await goal.deleteOne();

        res.status(200).json({ message: 'Goal removed successfully' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid goal ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
};