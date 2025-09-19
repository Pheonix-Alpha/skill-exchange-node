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

    // Convert skills to regex for case-insensitive matching
    const wantedRegex = currentUser.skillsWanted.map(
      (s) => new RegExp(`^${s}$`, "i")
    );
    const offeredRegex = currentUser.skillsOffered.map(
      (s) => new RegExp(`^${s}$`, "i")
    );

    // Must match BOTH conditions (mutual interest)
    const matches = await User.find({
      _id: { $ne: currentUser._id }, // exclude self
      skillsOffered: { $in: wantedRegex }, // they offer what I want
      skillsWanted: { $in: offeredRegex }, // they want what I offer
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
    console.error("Error fetching matches:", err);
    res.status(500).json({ error: err.message });
  }
});



export default router;
