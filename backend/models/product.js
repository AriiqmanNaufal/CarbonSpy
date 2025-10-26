// backend/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  url: String,
  title: String,
  description: String,
  material: String,
  category: String,
  estimated_co2_kg: Number,
  confidence: String,
  reasoning: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", ProductSchema);
