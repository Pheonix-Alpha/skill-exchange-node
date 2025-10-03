import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  room: { type: String, required: true },        // unique room ID
  sender: { type: String, required: true },      // sender username or id
  recipientId: { type: String, required: true }, // recipient id
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Message || mongoose.model("Message", messageSchema);
