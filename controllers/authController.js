// server/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/jwt');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        // Create new user (password will be hashed by pre-save middleware)
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                currencyPreference: user.currencyPreference,
                token: generateToken(user._id), // JWT token generate karein
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Fetch user from database (password select:false hai isliye use +password karein)
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists and password matches
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                currencyPreference: user.currencyPreference,
                token: generateToken(user._id), // JWT token generate karein
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    // req.user JWT middleware se aayega
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        currencyPreference: req.user.currencyPreference,
    });
};


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};