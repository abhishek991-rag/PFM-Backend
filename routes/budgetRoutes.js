const express = require("express");
const {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getBudgetStatus,
} = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createBudget).get(protect, getBudgets);

router.get("/status", protect, getBudgetStatus);

router
  .route("/:id")
  .get(protect, getBudgetById)
  .put(protect, updateBudget)
  .delete(protect, deleteBudget);

module.exports = router;
