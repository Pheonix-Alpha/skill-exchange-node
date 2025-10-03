import Message from "../models/Message.js";

export const chatHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Join private chat room
    socket.on("joinRoom", async ({ room }) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);

      // Load previous messages from DB
      const messages = await Message.find({ room }).sort({ timestamp: 1 });
      socket.emit("previousMessages", messages);
    });

    // Handle incoming messages
    socket.on("chatMessage", async ({ room, message }) => {
      const newMsg = new Message({
        room,
        sender: message.sender,
        recipientId: message.recipientId,
        text: message.text,
        timestamp: message.timestamp,
      });

      await newMsg.save();

      // Send message to all users in the room
      io.to(room).emit("chatMessage", newMsg);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};
