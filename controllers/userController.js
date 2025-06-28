const User = require("../models/User");
const bcrypt = require("bcryptjs");

const updateUserProfile = async (req, res) => {
  const userId = req.user._id;
  const { name, email, password, currencyPreference } = req.body;

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) {
      const userWithNewEmail = await User.findOne({ email });
      if (
        userWithNewEmail &&
        userWithNewEmail._id.toString() !== user._id.toString()
      ) {
        return res
          .status(400)
          .json({ message: "That email is already registered" });
      }
      user.email = email;
    }
    if (currencyPreference) user.currencyPreference = currencyPreference;

    if (password) {
      user.password = password;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      currencyPreference: user.currencyPreference,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error updating profile" });
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.deleteOne({ _id: userId });
    await Expense.deleteMany({ user: userId });
    await Income.deleteMany({ user: userId });
    await Budget.deleteMany({ user: userId });
    await Goal.deleteMany({ user: userId });

    res
      .status(200)
      .json({
        message: "User account and associated data removed successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting account" });
  }
};

module.exports = {
  updateUserProfile,
  deleteUserAccount,
};
