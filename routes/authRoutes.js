// server/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser); // Route for user registration
router.post('/login', loginUser);     // Route for user login
router.get('/profile', protect, getUserProfile); // Route for fetching user profile (protected)

module.exports = router;