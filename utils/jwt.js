// server/utils/jwt.js
const jwt = require('jsonwebtoken');

// JWT token generate karne ka function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token 30 din ke liye valid rahega
    });
};

module.exports = generateToken;