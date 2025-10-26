// backend/services/openaiTestService.js
import OpenAI from "openai";

export async function testOpenAI() {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say hello from CarbonSpy!" }
      ],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI connection error:", err); // Full error for debugging
    throw new Error("Connection error.");
  }
}
