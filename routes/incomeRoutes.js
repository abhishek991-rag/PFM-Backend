// server/routes/incomeRoutes.js
const express = require('express');
const {
    addIncome,
    getIncomes,
    getIncomeById,
    updateIncome,
    deleteIncome,
} = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware'); // Authentication middleware

const router = express.Router();

// All these routes will be protected by the 'protect' middleware
router.route('/')
    .post(protect, addIncome) // POST /api/income (Add new income)
    .get(protect, getIncomes); // GET /api/income (Get all income for the user)

router.route('/:id')
    .get(protect, getIncomeById)  // GET /api/income/:id (Get a single income record)
    .put(protect, updateIncome)   // PUT /api/income/:id (Update an income record)
    .delete(protect, deleteIncome); // DELETE /api/income/:id (Delete an income record)

module.exports = router;