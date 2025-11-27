import OpenAI from "openai";
import { apiKey } from "./env";
import chalk from "chalk";

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey,
})

export const askAI = async (context:string, question:string):Promise<string>=>{
    try {
        const prompt  = `
  You are a helpful assistant. 
  Based on this PDF content, answer the question accurately and concisely.
  
  === PDF CONTENT ===
  ${context.slice(0, 5000)}  // limit context to avoid token overflow
  
  === QUESTION ===
  ${question}
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  }) 
   return completion.choices[0].message?.content || "No response.";
    } catch (error) {
        chalk.red(console.log("error occured while processing file", error))
        throw new Error("AI processing failed");
    }
}



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
