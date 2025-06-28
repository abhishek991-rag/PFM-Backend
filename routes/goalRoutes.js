// server/routes/goalRoutes.js
const express = require('express');
const {
    addGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
} = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware'); // Authentication middleware

const router = express.Router();

// All these routes will be protected by the 'protect' middleware
router.route('/')
    .post(protect, addGoal) // POST /api/goals (Add a new goal)
    .get(protect, getGoals);   // GET /api/goals (Get all goals for the user)

router.route('/:id')
    .get(protect, getGoalById)  // GET /api/goals/:id (Get a single goal)
    .put(protect, updateGoal)   // PUT /api/goals/:id (Update a goal)
    .delete(protect, deleteGoal); // DELETE /api/goals/:id (Delete a goal)

module.exports = router;