const express = require("express");
const {
  updateUserProfile,
  deleteUserAccount,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/profile").put(protect, updateUserProfile);

router.delete("/delete-account", protect, deleteUserAccount);

module.exports = router;
