// server/routes/userRoutes.js
const express = require('express');
const { updateUserProfile, deleteUserAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Authentication middleware

const router = express.Router();

// All these routes will be protected by the 'protect' middleware
router.route('/profile')
    .put(protect, updateUserProfile); // PUT /api/users/profile (Update user profile)

router.delete('/delete-account', protect, deleteUserAccount); // DELETE /api/users/delete-account (Delete user account)

module.exports = router;