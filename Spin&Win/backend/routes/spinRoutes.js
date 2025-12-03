const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { spinSlot } = require("../controllers/spinController");

router.post("/", protect, spinSlot);

module.exports = router;
