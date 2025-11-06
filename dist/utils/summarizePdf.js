"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeChunk = void 0;
const openai_1 = __importDefault(require("openai"));
const env_1 = require("./env");
const openai = new openai_1.default({
    apiKey: env_1.apiKey,
    baseURL: "https://openrouter.ai/api/v1",
});
const summarizeChunk = async (chunk) => {
    try {
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
        return completion.choices[0].message.content;
    }
    catch (err) {
        console.error("OpenAI error:", err);
        throw err;
    }
};
exports.summarizeChunk = summarizeChunk;
