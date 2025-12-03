const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  rechargeBalance,
  getProfile,
  updatePassword,
  getTransactions,
  deleteTransaction,
  getLeaderboard,
} = require("../controllers/userController");

router.get("/profile", protect, getProfile);
router.post("/recharge", protect, rechargeBalance);
router.put("/change-password", protect, updatePassword);

// transactions
router.get("/transactions", protect, getTransactions);
router.delete("/transaction/:id", protect, deleteTransaction);

// leaderboard
router.get("/leaderboard", protect, getLeaderboard);

module.exports = router;
