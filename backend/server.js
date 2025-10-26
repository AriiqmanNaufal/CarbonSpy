// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import openaiRoute from "../backend/routes/openairoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- Inline Health Check Route ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CarbonSpy backend is running 🚀" });
});

//Services
app.use("/api/openai", openaiRoute);

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
