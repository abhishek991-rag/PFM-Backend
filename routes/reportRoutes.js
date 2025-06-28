const express = require("express");
const {
  getExpenseReport,
  getIncomeReport,
  getBudgetAdherenceReport,
  getOverviewReport,
} = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/expenses", protect, getExpenseReport);
router.get("/income", protect, getIncomeReport);
router.get("/budget-adherence", protect, getBudgetAdherenceReport);
router.get("/overview", protect, getOverviewReport);
module.exports = router;
