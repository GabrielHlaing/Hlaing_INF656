// controllers/spinController.js

const Transaction = require("../models/Transaction");
const User = require("../models/User");

const SYMBOLS = ["🍒", "🍋", "🍇", "🍉", "⭐"]; // 5 available symbols

exports.spinSlot = async (req, res) => {
  try {
    const bet = req.body.bet;

    if (!bet || bet <= 0) {
      return res.status(400).json({ message: "Invalid bet amount" });
    }

    // Check balance
    if (req.user.balance < bet) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct bet first
    req.user.balance -= bet;

    // 1. Generate 5 random symbols
    const reels = [];
    for (let i = 0; i < 5; i++) {
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      reels.push(symbol);
    }

    // 2. Count occurrences of each symbol
    const counts = {};
    reels.forEach((s) => {
      counts[s] = (counts[s] || 0) + 1;
    });

    // Find the highest match count
    const maxCount = Math.max(...Object.values(counts));

    // 3. Determine multiplier
    let result = "lose";
    let multiplier = 0;

    if (maxCount === 5) {
      result = "jackpot";
      multiplier = 10;
    } else if (maxCount === 4) {
      result = "big win";
      multiplier = 5;
    } else if (maxCount === 3) {
      result = "small win";
      multiplier = 3;
    }

    // 4. Calculate winnings
    const winAmount = bet * multiplier;

    // 5. Update balance
    req.user.balance += winAmount;
    await req.user.save();

    // 6. Save transaction
    await Transaction.create({
      userId: req.user._id,
      type: "spin",
      amount: winAmount - bet, // net profit/loss
      result,
      reels,
      bet,
    });

    // 7. Response to frontend
    res.json({
      reels, // frontend will animate toward these
      result,
      bet,
      winAmount,
      net: winAmount - bet,
      balance: req.user.balance,
    });
  } catch (err) {
    console.error("Spin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
