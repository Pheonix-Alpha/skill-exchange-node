import express from "express";
import Session from "../models/Session.js";
import Exchange from "../models/Exchange.js";
import { authMiddleware } from "../middleware/auth.js";
import { nanoid } from "nanoid";

const router = express.Router();

const JITSI_BASE = "https://meet.jit.si";

// Helper: attach meeting link (NO TIME RESTRICTION = instant join)
function withMeetingLink(session) {
  const obj = session.toObject();

  if (obj.roomId) {
    obj.meetingLink = `${JITSI_BASE}/${obj.roomId}`;
  } else {
    obj.meetingLink = null;
  }

  return obj;
}

// Create session request from accepted exchange
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { exchangeId, dateTime } = req.body;

    const exchange = await Exchange.findById(exchangeId)
      .populate("requester recipient", "name email");

    if (!exchange) return res.status(404).json({ message: "Exchange not found" });
    if (exchange.status !== "accepted") {
      return res.status(400).json({ message: "Exchange not accepted yet" });
    }

    const recipientId =
      exchange.recipient._id.toString() === req.user
        ? exchange.requester._id
        : exchange.recipient._id;

    const session = new Session({
      request: exchange._id,
      proposer: req.user,
      recipient: recipientId,
      dateTime,
      status: "scheduled",
      roomId: `skill-exchange-${nanoid(12)}`, // ✅ CREATED HERE
    });

    await session.save();

    res.json(withMeetingLink(session));
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

    if (!exchangeRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    const recipientId =
      exchangeRequest.recipient._id.toString() === req.user
        ? exchangeRequest.requester._id
        : exchangeRequest.recipient._id;

    const session = new Session({
      request: requestId,
      proposer: req.user,
      recipient: recipientId,
      dateTime,
      status: "scheduled",
      roomId: `skill-exchange-${nanoid(12)}`, // ✅ IMPORTANT FIX
    });

    await session.save();

    res.json(withMeetingLink(session));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all sessions for logged-in user — with time-gated meetingLink
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ proposer: req.user }, { recipient: req.user }]
    }).populate("proposer recipient request");

    // ✅ FIX: attach meetingLink only when it's time
    const result = sessions.map(withMeetingLink);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept / Reject session
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.recipient.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    session.status = status; // just tracking, NOT controlling meeting

    await session.save();

    res.json(withMeetingLink(session));
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

    await session.deleteOne();
    res.json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;