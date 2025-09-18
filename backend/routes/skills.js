import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Search users by skill
router.get("/search/:skill", async (req, res) => {
  try {
    const { skill } = req.params;
    const { type } = req.query; // "offering" or "wanting"
    let filter = {};

    if (type === "offering") {
      filter = { skillsOffered: { $in: [skill] } };
    } else if (type === "wanting") {
      filter = { skillsWanted: { $in: [skill] } };
    } else {
      filter = {
        $or: [
          { skillsOffered: { $in: [skill] } },
          { skillsWanted: { $in: [skill] } },
        ],
      };
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
