// server/controllers/reportController.js
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');

// Helper function to parse dates and set defaults
const parseDateRange = (startDate, endDate) => {
    const start = startDate ? new Date(startDate) : new Date(0); // Epoch start
    const end = endDate ? new Date(endDate) : new Date(); // Current date
    end.setHours(23, 59, 59, 999); // Set to end of the day for accurate range

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format. Please use YYYY-MM-DD.");
    }
    if (start > end) {
        throw new Error("Start date cannot be after end date.");
    }
    return { start, end };
};

// @desc    Generate Expense Report
// @route   GET /api/reports/expenses
// @access  Private
const getExpenseReport = async (req, res) => {
    try {
        const { startDate, endDate, category } = req.query;
        const { start, end } = parseDateRange(startDate, endDate);

        const matchQuery = {
            user: req.user.id,
            date: { $gte: start, $lte: end },
        };

        if (category) {
            matchQuery.category = category;
        }

        const expenses = await Expense.find(matchQuery).sort({ date: 1 });

        // Calculate total expenses and group by category
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const expensesByCategory = expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});

        res.status(200).json({
            message: 'Expense report generated successfully',
            period: { startDate: start.toISOString(), endDate: end.toISOString() },
            filterCategory: category || 'All',
            totalExpenses,
            expensesByCategory,
            detailedExpenses: expenses,
        });

    } catch (error) {
        console.error(error);
        if (error.message.includes("date")) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error generating expense report' });
    }
};

// @desc    Generate Income Report
// @route   GET /api/reports/income
// @access  Private
const getIncomeReport = async (req, res) => {
    try {
        const { startDate, endDate, source } = req.query;
        const { start, end } = parseDateRange(startDate, endDate);

        const matchQuery = {
            user: req.user.id,
            date: { $gte: start, $lte: end },
        };

        if (source) {
            matchQuery.source = source;
        }

        const incomes = await Income.find(matchQuery).sort({ date: 1 });

        const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
        const incomeBySource = incomes.reduce((acc, inc) => {
            acc[inc.source] = (acc[inc.source] || 0) + inc.amount;
            return acc;
        }, {});

        res.status(200).json({
            message: 'Income report generated successfully',
            period: { startDate: start.toISOString(), endDate: end.toISOString() },
            filterSource: source || 'All',
            totalIncome,
            incomeBySource,
            detailedIncomes: incomes,
        });

    } catch (error) {
        console.error(error);
        if (error.message.includes("date")) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error generating income report' });
    }
};

// @desc    Generate Budget Adherence Report
// @route   GET /api/reports/budget-adherence
// @access  Private
const getBudgetAdherenceReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const { start, end } = parseDateRange(startDate, endDate);

        // Fetch budgets overlapping with the specified period
        const budgets = await Budget.find({
            user: req.user.id,
            startDate: { $lte: end },
            endDate: { $gte: start }
        }).sort({ category: 1, startDate: 1 });

        if (budgets.length === 0) {
            return res.status(200).json({
                message: 'No budgets found for the specified period.',
                period: { startDate: start.toISOString(), endDate: end.toISOString() },
                budgetSummary: [],
                totalBudgeted: 0,
                totalSpent: 0
            });
        }

        // Fetch expenses within the specified period for all categories
        const expenses = await Expense.find({
            user: req.user.id,
            date: { $gte: start, $lte: end }
        });

        let totalBudgetedOverall = 0;
        let totalSpentOverall = 0;
        const budgetSummary = [];

        // Process each relevant budget
        for (const budget of budgets) {
            // Calculate spent amount specific to this budget's category and timeframe
            const spentForBudget = expenses
                .filter(exp =>
                    exp.category === budget.category &&
                    exp.date >= budget.startDate && // Only expenses within this specific budget's start/end dates
                    exp.date <= budget.endDate
                )
                .reduce((sum, exp) => sum + exp.amount, 0);

            const remaining = budget.amount - spentForBudget;
            const isExceeded = spentForBudget > budget.amount;

            totalBudgetedOverall += budget.amount;
            totalSpentOverall += spentForBudget;

            budgetSummary.push({
                _id: budget._id,
                category: budget.category,
                budgetedAmount: budget.amount,
                spentAmount: spentForBudget,
                remainingAmount: remaining,
                isExceeded: isExceeded,
                budgetPeriod: {
                    startDate: budget.startDate.toISOString(),
                    endDate: budget.endDate.toISOString()
                }
            });
        }

        res.status(200).json({
            message: 'Budget adherence report generated successfully',
            period: { startDate: start.toISOString(), endDate: end.toISOString() },
            totalBudgeted: totalBudgetedOverall,
            totalSpent: totalSpentOverall,
            overallRemaining: totalBudgetedOverall - totalSpentOverall,
            budgetSummary, // Array of each budget's performance
        });

    } catch (error) {
        console.error(error);
        if (error.message.includes("date")) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error generating budget adherence report' });
    }
};


// @desc    Generate Overview Report (Income vs Expense)
// @route   GET /api/reports/overview
// @access  Private
const getOverviewReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const { start, end } = parseDateRange(startDate, endDate);

        const incomeQuery = {
            user: req.user.id,
            date: { $gte: start, $lte: end }
        };
        const expenseQuery = {
            user: req.user.id,
            date: { $gte: start, $lte: end }
        };

        const totalIncome = (await Income.find(incomeQuery)).reduce((sum, inc) => sum + inc.amount, 0);
        const totalExpenses = (await Expense.find(expenseQuery)).reduce((sum, exp) => sum + exp.amount, 0);

        const netSavings = totalIncome - totalExpenses;

        res.status(200).json({
            message: 'Overview report generated successfully',
            period: { startDate: start.toISOString(), endDate: end.toISOString() },
            totalIncome,
            totalExpenses,
            netSavings,
            status: netSavings >= 0 ? 'Surplus' : 'Deficit'
        });

    } catch (error) {
        console.error(error);
        if (error.message.includes("date")) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error generating overview report' });
    }
};


module.exports = {
    getExpenseReport,
    getIncomeReport,
    getBudgetAdherenceReport,
    getOverviewReport,
};