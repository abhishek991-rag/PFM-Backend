// server/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Password update ke liye

// @desc    Get user profile (already handled by authController.js as getUserProfile)
//          But can be extended here for more user-specific settings.
// @route   GET /api/users/profile
// @access  Private
// Note: Is function ko authController se yahan move kiya ja sakta hai agar user-specific logic badhe.
//       Abhi ke liye, authController.js mein 'getUserProfile' rehne dete hain.

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const userId = req.user._id; // Middleware se user ID mil jaegi
    const { name, email, password, currencyPreference } = req.body;

    try {
        const user = await User.findById(userId).select('+password'); // Password ko bhi fetch karein agar update karna hai

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (email) {
            // Check if new email already exists for another user
            const userWithNewEmail = await User.findOne({ email });
            if (userWithNewEmail && userWithNewEmail._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'That email is already registered' });
            }
            user.email = email;
        }
        if (currencyPreference) user.currencyPreference = currencyPreference;

        // Handle password update
        if (password) {
            // Password hashing is handled by pre-save middleware in User model
            user.password = password; // Mongoose middleware will hash this
        }

        await user.save(); // Save the updated user (pre-save hook will hash password if changed)

        // Response with updated user details (without password)
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            currencyPreference: user.currencyPreference,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

// @desc    Delete user account
// @route   DELETE /api/users/delete-account
// @access  Private
const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        // Optional: You might want to delete all associated data (expenses, incomes, budgets, goals)
        // or transfer them to an anonymous user, depending on your app's requirements.
        // For simplicity, we'll just delete the user and rely on MongoDB's cascade delete (if set up)
        // or handle orphaned documents later.
        await User.deleteOne({ _id: userId });
        await Expense.deleteMany({ user: userId });
        await Income.deleteMany({ user: userId });
        await Budget.deleteMany({ user: userId });
        await Goal.deleteMany({ user: userId });


        res.status(200).json({ message: 'User account and associated data removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting account' });
    }
};


module.exports = {
    updateUserProfile,
    deleteUserAccount
    // getUserProfile, // If you decide to move it from authController
};