import express from "express";
import Exchange from "../models/Exchange.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Send exchange request
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { recipientId, skillOffered, skillWanted } = req.body;

    if (recipientId === req.user) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    // optional: prevent duplicate pending requests
    const existing = await Exchange.findOne({
      requester: req.user,
      recipient: recipientId,
      skillOffered,
      skillWanted,
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({ message: "You already sent a similar request" });
    }

    const exchange = new Exchange({
      requester: req.user,
      recipient: recipientId,
      skillOffered: skillOffered.trim(),
      skillWanted: skillWanted.trim()
    });

    await exchange.save();
    res.json({ message: "Request sent successfully", exchange });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all requests for logged-in user
router.get("/my-requests", authMiddleware, async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      $or: [{ requester: req.user }, { recipient: req.user }]
    }).populate("requester recipient", "name email skillsOffered skillsWanted");

    res.json(exchanges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept / Reject request
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body; // accepted / rejected
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) return res.status(404).json({ message: "Request not found" });
    if (exchange.recipient.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    exchange.status = status;
    await exchange.save();

    res.json({ message: `Request ${status}`, exchange });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark request as completed
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) return res.status(404).json({ message: "Request not found" });
    if (
      exchange.requester.toString() !== req.user &&
      exchange.recipient.toString() !== req.user
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    exchange.status = "completed";
    await exchange.save();

    res.json({ message: "Request marked as completed", exchange });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
