// server/routes/expenseRoutes.js
const express = require('express');
const {
    addExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware'); // Authentication middleware

const router = express.Router();

// All these routes will be protected by the 'protect' middleware
router.route('/')
    .post(protect, addExpense) // POST /api/expenses (Add a new expense)
    .get(protect, getExpenses); // GET /api/expenses (Get all expenses for the user)

router.route('/:id')
    .get(protect, getExpenseById) // GET /api/expenses/:id (Get a single expense)
    .put(protect, updateExpense)  // PUT /api/expenses/:id (Update an expense)
    .delete(protect, deleteExpense); // DELETE /api/expenses/:id (Delete an expense)

module.exports = router;