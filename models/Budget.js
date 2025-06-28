const mongoose = require("mongoose");

const budgetSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  category: {
    type: String,
    required: [true, "Please provide a category for the budget"],

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
      "All Categories",
    ],
    default: "Others",
  },
  amount: {
    type: Number,
    required: [true, "Please provide a budget amount"],
    min: [0.01, "Budget amount must be greater than 0"],
  },
  startDate: {
    type: Date,
    required: [true, "Please provide a start date for the budget"],
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: [true, "Please provide an end date for the budget"],

    validate: {
      validator: function (v) {
        return v >= this.startDate;
      },
      message: (props) =>
        `End date (<span class="math-inline">\{props\.value\}\) must be after or on the start date \(</span>{props.path.startDate})!`,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Budget", budgetSchema);
