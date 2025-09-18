import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Exchange", required: true },
    proposer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dateTime: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" },
    zoomLink: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
