import OpenAI from "openai";
import { apiKey } from "./env";

const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://openrouter.ai/api/v1",
})

export const summarizeChunk = async (chunk:string)=>{
    try {
      console.log("got to ai")
    const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // or "gpt-4o" / Claude / Qwen / Mixtral
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that summarizes long documents clearly and concisely.",
      },
      {
        role: "user",
        content: `Summarize the following text in 5-7 sentences:\n\n${chunk}`,
      },
    ],
  });
  console.log("results",completion.choices[0].message.content)
  return completion.choices[0].message.content;
    } catch (err) {
       console.error("OpenAI error:", err);
  throw err;
    }
}