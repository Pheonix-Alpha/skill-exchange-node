import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Suggested matches for logged-in user
router.get("/matches", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user).select(
      "skillsOffered skillsWanted name email"
    );

    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // Find users who match
    const matches = await User.find({
      _id: { $ne: currentUser._id }, // exclude self
      $or: [
        { skillsOffered: { $in: currentUser.skillsWanted } }, // they offer what I want
        { skillsWanted: { $in: currentUser.skillsOffered } }, // they want what I offer
      ],
    }).select("name email skillsOffered skillsWanted");

    // Format response
    const formatted = matches.map((u) => ({
      id: u._id,
      username: u.name,
      email: u.email,
      offeringSkills: u.skillsOffered,
      wantingSkills: u.skillsWanted,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
