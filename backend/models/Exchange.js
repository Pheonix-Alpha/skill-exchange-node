import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who sent request
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who receives request
  skillOffered: { type: String, required: true },   // skill requester offers
  skillWanted: { type: String, required: true },    // skill requester wants
  status: { type: String, enum: ["pending", "accepted", "rejected", "completed"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Exchange", exchangeSchema);
