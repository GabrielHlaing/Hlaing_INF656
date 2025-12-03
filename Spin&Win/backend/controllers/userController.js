const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // refetch user WITH password
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("UpdatePassword ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rechargeBalance = async (req, res) => {
  const { amount } = req.body;

  req.user.balance += amount;
  await req.user.save();

  await Transaction.create({
    userId: req.user._id,
    type: "recharge",
    amount,
  });

  res.json({ message: "Balance updated", balance: req.user.balance });
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(transactions);
  } catch (err) {
    console.error("getTransactions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;

    const trx = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!trx) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("deleteTransaction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Transaction.aggregate([
      // 1. Only spin-type transactions
      { $match: { type: "spin" } },

      // 2. Group by user and sum amounts
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$amount" },
        },
      },

      // 3. Join with users collection
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      // 4. Clean up user array → user object
      { $unwind: "$user" },

      // 5. Format output
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          username: "$user.username",
          email: "$user.email",
          totalScore: 1,
        },
      },

      // 6. Sort by highest score first
      { $sort: { totalScore: -1 } },
    ]);

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: "Failed to load leaderboard", error: err });
  }
};
