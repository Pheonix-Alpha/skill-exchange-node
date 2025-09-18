import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import skillRoutes from "./routes/skills.js";
import exchangeRoutes from "./routes/exchange.js";
import matchRoutes from "./routes/match.js"
import cors from "cors";


dotenv.config();
const app = express();
app.use(express.json());




// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


  app.use(cors({
    origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],// your frontend URL
  credentials: true,               // if you need cookies
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/exchange", exchangeRoutes);
app.use("/api/match", matchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
