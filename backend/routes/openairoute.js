import express from "express";
import { testOpenAI } from "../services/openaitest.js";

const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    const reply = await testOpenAI();
    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
