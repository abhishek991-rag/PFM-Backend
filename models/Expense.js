const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  amount: {
    type: Number,
    required: [true, "Please add an amount"],
    min: [0.01, "Amount must be greater than 0"],
  },
  category: {
    type: String,
    required: [true, "Please select a category"],
    enum: [
      "Food",
      "Transport",
      "Utilities",
      "Rent",
      "Entertainment",
      "Groceries",
      "Shopping",
      "Healthcare",
      "Education",
      "Salary",
      "Bills",
      "Travel",
      "Others",
    ],
    default: "Others",
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, "Description cannot be more than 200 characters"],
  },
  date: {
    type: Date,
    required: [true, "Please add a date"],
    default: Date.now,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringFrequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly", null],
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
