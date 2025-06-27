// server/routes/reportRoutes.js
const express = require('express');
const {
    getExpenseReport,
    getIncomeReport,
    getBudgetAdherenceReport,
    getOverviewReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware'); // Authentication middleware

const router = express.Router();

// All these routes will be protected by the 'protect' middleware
router.get('/expenses', protect, getExpenseReport);         // GET /api/reports/expenses
router.get('/income', protect, getIncomeReport);           // GET /api/reports/income
router.get('/budget-adherence', protect, getBudgetAdherenceReport); // GET /api/reports/budget-adherence
router.get('/overview', protect, getOverviewReport);       // GET /api/reports/overview

module.exports = router;