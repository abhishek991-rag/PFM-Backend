const mongoose = require("mongoose");

const goalSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "Please add a goal name"],
    trim: true,
    maxlength: [100, "Goal name cannot be more than 100 characters"],
  },
  targetAmount: {
    type: Number,
    required: [true, "Please add a target amount"],
    min: [0.01, "Target amount must be greater than 0"],
  },
  savedAmount: {
    type: Number,
    default: 0,
    min: [0, "Saved amount cannot be negative"],
  },
  targetDate: {
    type: Date,
    required: [true, "Please add a target date"],
    validate: {
      validator: function (v) {
        return v >= new Date();
      },
      message: (props) => `Target date (${props.value}) must be in the future!`,
    },
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Goal", goalSchema);
