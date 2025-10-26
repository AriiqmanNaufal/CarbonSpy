// backend/routes/analyzeRoute.js
import express from "express";
import { scrapePage } from "../services/scraper.js";
import { analyzeWithOpenAI } from "../services/openai.js";
import Product from "../models/product.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const { title, description } = await scrapePage(url);
    const analysis = await analyzeWithOpenAI({ title, description });

    const product = await Product.create({
      url,
      title,
      description,
      ...analysis
    });

    res.json(product);
  } catch (err) {
    console.error("❌ Analyze route error:", err);
    res.status(500).json({ error: "Failed to analyze product" });
  }
});

router.get("/reports", async (req, res) => {
  const reports = await Product.find().sort({ createdAt: -1 }).limit(20);
  res.json(reports);
});

export default router;
