// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Password hashing ke liye

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, // Email unique hona chahiye
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6, // Password ki minimum length
        select: false, // Jab user data fetch karein toh password na dikhe automatically
    },
    // Baaki user profile fields yahan add kiye ja sakte hain (jaise currency preference)
    currencyPreference: {
        type: String,
        default: 'INR', // Default currency
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// --- Password Hashing Middleware ---
// Save hone se pehle password ko hash karein
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) { // Agar password modify nahi hua hai, toh skip karein
        next();
    }
    const salt = await bcrypt.genSalt(10); // Salt generate karein
    this.password = await bcrypt.hash(this.password, salt); // Password ko hash karein
    next();
});

// --- Password Comparison Method ---
// User ke entered password ko hashed password se compare karne ke liye method
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);