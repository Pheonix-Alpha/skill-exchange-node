import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// Routes
import authRoutes from "./routes/auth.js";
import skillRoutes from "./routes/skills.js";
import exchangeRoutes from "./routes/exchange.js";
import matchRoutes from "./routes/match.js";
import profileRoutes from "./routes/profile.js";
import sessionRoutes from "./routes/sessions.js";

// Chat handler
import { chatHandler } from "./socket/chat.js";

// Load environment variables
dotenv.config();

const app = express();

// Determine allowed frontend origins dynamically
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
];

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", skillRoutes);
app.use("/api/exchange", exchangeRoutes);
app.use("/api", matchRoutes);
app.use("/api", profileRoutes);
app.use("/api/session", sessionRoutes);

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach chat logic
chatHandler(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
