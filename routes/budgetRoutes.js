// server/routes/budgetRoutes.js
const express = require('express');
const {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
    getBudgetStatus,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware'); // Authentication middleware

const router = express.Router();

// All these routes will be protected by the 'protect' middleware
router.route('/')
    .post(protect, createBudget) // POST /api/budgets (Create a new budget)
    .get(protect, getBudgets);   // GET /api/budgets (Get all budgets for the user)

router.get('/status', protect, getBudgetStatus); // GET /api/budgets/status (Get overall budget status)

router.route('/:id')
    .get(protect, getBudgetById)  // GET /api/budgets/:id (Get a single budget)
    .put(protect, updateBudget)   // PUT /api/budgets/:id (Update a budget)
    .delete(protect, deleteBudget); // DELETE /api/budgets/:id (Delete a budget)

module.exports = router;