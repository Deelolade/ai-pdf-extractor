import { chunkText } from "./chunkText"
import { summarizeChunk } from "./summarizePdf";

export const summarizeFullPdf = async (text: string) =>{
    const chunks = chunkText(text);
    console.log("chunk created:", chunks.length)
    const summaries = [];

    for (const chunk of chunks){
        const summary = await summarizeChunk(chunk);
        summaries.push(summary);
    }
    const finalSummary =  await summarizeChunk(summaries.join("\n"));
    return finalSummary;
}