import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Search users by skill
router.get("/search/:skill", async (req, res) => {
  const skill = req.params.skill;
  const users = await User.find({
    $or: [
      { skillsOffered: { $in: [skill] } },
      { skillsWanted: { $in: [skill] } }
    ]
  });

  res.json(users);
});

// Update skills (only for logged-in user)
router.put("/update", authMiddleware, async (req, res) => {
  const { skillsOffered, skillsWanted } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { skillsOffered, skillsWanted },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
