// backend/services/dbService.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI not set — skipping DB connection.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect MongoDB:", err.message);
  }
}
