const Expense = require("../models/Expense");
const User = require("../models/User");

const addExpense = async (req, res) => {
  const {
    amount,
    category,
    description,
    date,
    isRecurring,
    recurringFrequency,
  } = req.body;

  if (!amount || !category || !date) {
    return res
      .status(400)
      .json({ message: "Please include amount, category, and date" });
  }

  if (amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }

  try {
    const expense = await Expense.create({
      user: req.user.id,
      amount,
      category,
      description,
      date,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : null,
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      date: -1,
      createdAt: -1,
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (error) {
    console.error(error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid expense ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const updateExpense = async (req, res) => {
  const {
    amount,
    category,
    description,
    date,
    isRecurring,
    recurringFrequency,
  } = req.body;

  try {
    let expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.description =
      description !== undefined ? description : expense.description;
    expense.date = date || expense.date;
    expense.isRecurring =
      isRecurring !== undefined ? isRecurring : expense.isRecurring;
    expense.recurringFrequency = isRecurring
      ? recurringFrequency || expense.recurringFrequency
      : null;

    await expense.save();

    res.status(200).json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid expense ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.deleteOne();

    res.status(200).json({ message: "Expense removed successfully" });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid expense ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
