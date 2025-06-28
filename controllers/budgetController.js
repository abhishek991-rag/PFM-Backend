// server/controllers/budgetController.js
const Budget = require('../models/Budget');
const Expense = require('../models/Expense'); // Budget monitoring ke liye expenses ki zaroorat padegi

// @desc    Create a new budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res) => {
    const { category, amount, startDate, endDate } = req.body;

    // Validation
    if (!category || !amount || !startDate || !endDate) {
        return res.status(400).json({ message: 'Please provide all required fields: category, amount, start date, and end date' });
    }

    if (amount <= 0) {
        return res.status(400).json({ message: 'Budget amount must be a positive number' });
    }

    try {
        // Check for overlapping budgets for the same category and user (optional but recommended)
        // This is a basic check. More complex logic might be needed for 'All Categories' vs specific.
        const existingBudget = await Budget.findOne({
            user: req.user.id,
            category,
            $or: [ // Check for any overlap
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });

        if (existingBudget) {
             return res.status(409).json({ message: 'An overlapping budget already exists for this category and period.' });
        }


        const budget = await Budget.create({
            user: req.user.id,
            category,
            amount,
            startDate,
            endDate,
        });

        res.status(201).json({
            message: 'Budget created successfully',
            budget,
        });
    } catch (error) {
        console.error(error);
        // Handle validation errors from Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id }).sort({ startDate: -1 });
        res.status(200).json(budgets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single budget by ID
// @route   GET /api/budgets/:id
// @access  Private
const getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.status(200).json(budget);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid budget ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
    const { category, amount, startDate, endDate } = req.body;

    try {
        let budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        // Update fields
        budget.category = category || budget.category;
        budget.amount = amount || budget.amount;
        budget.startDate = startDate || budget.startDate;
        budget.endDate = endDate || budget.endDate;

        await budget.save();

        res.status(200).json({
            message: 'Budget updated successfully',
            budget,
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') { // For date validation
            return res.status(400).json({ message: error.message });
        }
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid budget ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        await budget.deleteOne();

        res.status(200).json({ message: 'Budget removed successfully' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid budget ID' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get budget status (e.g., spent vs budgeted)
// @route   GET /api/budgets/status
// @access  Private
const getBudgetStatus = async (req, res) => {
    try {
        const { startDate, endDate, category } = req.query; // Query params se dates aur category lein

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Please provide start and end dates for budget status.' });
        }

        const query = {
            user: req.user.id,
            startDate: { $lte: new Date(endDate) }, // Budget should start before or on end date
            endDate: { $gte: new Date(startDate) }   // Budget should end after or on start date
        };

        // If a category is specified, filter budgets by that category
        if (category && category !== 'All Categories') {
            query.category = category;
        }


        const budgets = await Budget.find(query);

        if (budgets.length === 0) {
            return res.status(200).json({ message: 'No budgets found for the specified criteria.', totalBudgeted: 0, totalSpent: 0, budgets: [] });
        }

        let totalBudgeted = 0;
        let totalSpent = 0;
        let budgetDetails = [];

        // Calculate total budgeted amount from fetched budgets
        budgets.forEach(budget => {
            totalBudgeted += budget.amount;
        });

        // Calculate total expenses for the given period and category
        const expenseQuery = {
            user: req.user.id,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };
        // If a specific category budget is requested, filter expenses by that category
        if (category && category !== 'All Categories') {
             expenseQuery.category = category;
        }


        const expenses = await Expense.find(expenseQuery);

        expenses.forEach(expense => {
            totalSpent += expense.amount;
        });

        // For detailed budget breakdown
        for (const budget of budgets) {
            const spentForCategory = expenses
                .filter(exp => exp.category === budget.category && exp.date >= budget.startDate && exp.date <= budget.endDate)
                .reduce((sum, exp) => sum + exp.amount, 0);

            budgetDetails.push({
                _id: budget._id,
                category: budget.category,
                budgetedAmount: budget.amount,
                spentAmount: spentForCategory,
                remainingAmount: budget.amount - spentForCategory,
                startDate: budget.startDate,
                endDate: budget.endDate,
                isExceeded: spentForCategory > budget.amount
            });
        }


        res.status(200).json({
            message: 'Budget status retrieved successfully',
            totalBudgeted,
            totalSpent,
            remainingBudget: totalBudgeted - totalSpent,
            budgetDetails, // Detailed breakdown
            budgetsCount: budgets.length
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
    getBudgetStatus,
};