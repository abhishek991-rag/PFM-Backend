const express = require("express");
const {
  addIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, addIncome).get(protect, getIncomes);

router
  .route("/:id")
  .get(protect, getIncomeById)
  .put(protect, updateIncome)
  .delete(protect, deleteIncome);

module.exports = router;
