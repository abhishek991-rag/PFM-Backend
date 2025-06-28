const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

const createBudget = async (req, res) => {
  const { category, amount, startDate, endDate } = req.body;

  if (!category || !amount || !startDate || !endDate) {
    return res
      .status(400)
      .json({
        message:
          "Please provide all required fields: category, amount, start date, and end date",
      });
  }

  if (amount <= 0) {
    return res
      .status(400)
      .json({ message: "Budget amount must be a positive number" });
  }

  try {
    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category,
      $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }],
    });

    if (existingBudget) {
      return res
        .status(409)
        .json({
          message:
            "An overlapping budget already exists for this category and period.",
        });
    }

    const budget = await Budget.create({
      user: req.user.id,
      category,
      amount,
      startDate,
      endDate,
    });

    res.status(201).json({
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({
      startDate: -1,
    });
    res.status(200).json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    res.status(200).json(budget);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid budget ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const updateBudget = async (req, res) => {
  const { category, amount, startDate, endDate } = req.body;

  try {
    let budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    budget.category = category || budget.category;
    budget.amount = amount || budget.amount;
    budget.startDate = startDate || budget.startDate;
    budget.endDate = endDate || budget.endDate;

    await budget.save();

    res.status(200).json({
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid budget ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    await budget.deleteOne();

    res.status(200).json({ message: "Budget removed successfully" });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid budget ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const getBudgetStatus = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({
          message: "Please provide start and end dates for budget status.",
        });
    }

    const query = {
      user: req.user.id,
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
    };

    if (category && category !== "All Categories") {
      query.category = category;
    }

    const budgets = await Budget.find(query);

    if (budgets.length === 0) {
      return res
        .status(200)
        .json({
          message: "No budgets found for the specified criteria.",
          totalBudgeted: 0,
          totalSpent: 0,
          budgets: [],
        });
    }

    let totalBudgeted = 0;
    let totalSpent = 0;
    let budgetDetails = [];

    budgets.forEach((budget) => {
      totalBudgeted += budget.amount;
    });

    const expenseQuery = {
      user: req.user.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (category && category !== "All Categories") {
      expenseQuery.category = category;
    }

    const expenses = await Expense.find(expenseQuery);

    expenses.forEach((expense) => {
      totalSpent += expense.amount;
    });

    for (const budget of budgets) {
      const spentForCategory = expenses
        .filter(
          (exp) =>
            exp.category === budget.category &&
            exp.date >= budget.startDate &&
            exp.date <= budget.endDate
        )
        .reduce((sum, exp) => sum + exp.amount, 0);

      budgetDetails.push({
        _id: budget._id,
        category: budget.category,
        budgetedAmount: budget.amount,
        spentAmount: spentForCategory,
        remainingAmount: budget.amount - spentForCategory,
        startDate: budget.startDate,
        endDate: budget.endDate,
        isExceeded: spentForCategory > budget.amount,
      });
    }

    res.status(200).json({
      message: "Budget status retrieved successfully",
      totalBudgeted,
      totalSpent,
      remainingBudget: totalBudgeted - totalSpent,
      budgetDetails,
      budgetsCount: budgets.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
