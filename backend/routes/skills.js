import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Search users by skill
// Search users by skill
router.get("/search/:skill", authMiddleware, async (req, res) => {
  try {
    const { skill } = req.params;
    const { type } = req.query; // "offering" or "wanting"
    const userId = req.user; // current logged-in user id

    if (!skill || skill.trim() === "") {
      return res.status(400).json({ message: "Skill is required" });
    }

    let filter = { _id: { $ne: userId } }; // exclude current user
    const regex = new RegExp(`^${skill}$`, "i"); // stricter case-insensitive match

    if (type === "offering") {
      filter.skillsOffered = { $in: [regex] };
    } else if (type === "wanting") {
      filter.skillsWanted = { $in: [regex] };
    } else {
      filter.$or = [
        { skillsOffered: { $in: [regex] } },
        { skillsWanted: { $in: [regex] } },
      ];
    }

    const users = await User.find(filter).select("-password");

    const formatted = users.map((u) => ({
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
