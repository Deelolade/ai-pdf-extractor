"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askAI = void 0;
const openai_1 = __importDefault(require("openai"));
const env_1 = require("./env");
const chalk_1 = __importDefault(require("chalk"));
const openai = new openai_1.default({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: env_1.apiKey,
});
const askAI = async (context, question) => {
    try {
        const prompt = `
  You are a helpful assistant. 
  Based on this PDF content, answer the question accurately and concisely.
  
  === PDF CONTENT ===
  ${context.slice(0, 6000)}  // limit context to avoid token overflow
  
  === QUESTION ===
  ${question}
  `;
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });
        return completion.choices[0].message?.content || "No response.";
    }
    catch (error) {
        chalk_1.default.red(console.log("error occured while processing file", error));
        throw new Error("AI processing failed");
    }
};
exports.askAI = askAI;
// export async function main() {
//   const completion = await openai.chat.completions.create({
//     model: 'openai/gpt-4o',
//     messages: [
//       {
//         role: 'user',
//         content: 'Who is davido?',
//       },
//     ],
//   });
//   console.log(completion.choices[0].message);
// }
// main();
