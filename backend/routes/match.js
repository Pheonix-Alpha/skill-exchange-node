import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// 🔥 Helper: normalize skills
const normalizeSkills = (skills = []) =>
  skills.map((s) => s.toLowerCase().trim());

// 🔥 GET MATCHES
router.get("/matches", authMiddleware, async (req, res) => {
  try {
    // 1. Get current user
    const currentUser = await User.findById(req.user).select(
      "skillsOffered skillsWanted name email"
    );

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Normalize skills
    const wanted = normalizeSkills(currentUser.skillsWanted);
    const offered = normalizeSkills(currentUser.skillsOffered);

    // 3. Find mutual matches
    const users = await User.find({
      _id: { $ne: currentUser._id },
      skillsOffered: { $in: wanted },
      skillsWanted: { $in: offered },
    })
      .select("name email skillsOffered skillsWanted")
      .limit(20); // prevent overload

    // 4. Add match score + format response
    const matches = users
      .map((u) => {
        const offeredSkills = normalizeSkills(u.skillsOffered);
        const wantedSkills = normalizeSkills(u.skillsWanted);

        const matchScore = offeredSkills.filter((skill) =>
          wanted.includes(skill)
        ).length;

        return {
          id: u._id,
          username: u.name,
          email: u.email,
          offeringSkills: u.skillsOffered,
          wantingSkills: u.skillsWanted,
          matchScore,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      count: matches.length,
      matches,
    });
  } catch (err) {
    console.error("❌ Match error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;