import express from "express";
import Session from "../models/Session.js";
import Exchange from "../models/Exchange.js";
import { authMiddleware } from "../middleware/auth.js";
import { nanoid } from "nanoid";

const router = express.Router();

// Create session request from accepted exchange
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { exchangeId, dateTime } = req.body;

    const exchange = await Exchange.findById(exchangeId)
      .populate("requester recipient", "name email");

    if (!exchange) return res.status(404).json({ message: "Exchange not found" });
    if (exchange.status !== "accepted") return res.status(400).json({ message: "Exchange not accepted yet" });

    const recipientId = exchange.recipient._id.toString() === req.user
      ? exchange.requester._id
      : exchange.recipient._id;

    const session = new Session({
      request: exchange._id,
      proposer: req.user,
      recipient: recipientId,
      dateTime,
      status: "pending"
    });

    await session.save();
    res.json(session);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send session request (alternative route)
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { requestId, dateTime } = req.body;

    const exchangeRequest = await Exchange.findById(requestId)
      .populate("requester recipient");

    if (!exchangeRequest) return res.status(404).json({ message: "Request not found" });

    const recipientId = exchangeRequest.recipient._id.toString() === req.user
      ? exchangeRequest.requester._id
      : exchangeRequest.recipient._id;

    const session = new Session({
      request: requestId,
      proposer: req.user,
      recipient: recipientId,
      dateTime,
      status: "pending",
    });

    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all sessions for logged-in user
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ proposer: req.user }, { recipient: req.user }]
    }).populate("proposer recipient request");

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept / Reject session
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body; // "confirmed" / "rejected"
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.recipient.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    session.status = status;

    // If confirmed, generate Zoom link
    if (status === "confirmed") {
      session.zoomLink = `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`;
    }

    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete session (cancel)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.proposer.toString() !== req.user && session.recipient.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await session.remove();
    res.json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
