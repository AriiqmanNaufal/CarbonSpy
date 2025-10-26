// backend/services/aiService.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

export async function analyzeWithOpenAI({ title, description }) {
  const systemPrompt = `
You are a sustainability analyst.
Analyze the product below and return a JSON object ONLY with keys:
"material", "category", "estimated_co2_kg", "confidence", "reasoning".
Estimate values using realistic heuristics and keep reasoning concise.
`;

  const userInput = `Title: ${title}\n\nDescription: ${description}`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ],
      max_tokens: 300,
      temperature: 0,
    });

    const text = response.choices[0].message.content.trim();
    const parsed = JSON.parse(text);
    parsed.estimated_co2_kg = Number(parsed.estimated_co2_kg) || 3.0;
    return parsed;
  } catch (err) {
    console.error("OpenAI error:", err.message);
    return {
      material: "unknown",
      category: "unknown",
      estimated_co2_kg: 3.0,
      confidence: "low",
      reasoning: "Fallback result due to API error or invalid JSON."
    };
  }
}
