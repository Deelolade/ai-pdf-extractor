import { NextFunction, Request, Response } from "express"
import { errorHandler } from "../utils/errorHandler"
import OpenAI from "openai";
import { apiKey, PINECONE_INDEX } from "../utils/env";
import { Upload } from "../models/upload.model";
import { pc } from "../utils/pinecone";

const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://openrouter.ai/api/v1",
})
export const converseWithLLM = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message , uploadId } = req.body;
        if (!message || !uploadId) {
            return next(errorHandler(400, "Message and Upload ID are required"))
        }
        const upload = await Upload.findOne({ _id: uploadId, userId: req.user?.id });

        const queryEmbeddings = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: message
        })

        const index = pc.index(PINECONE_INDEX);

        if(!queryEmbeddings?.data?.[0]?.embedding){
            return next(errorHandler(500, "Failed to generate embeddings"))
        }
        console.log("Embedding length:", queryEmbeddings.data[0].embedding.length);
        const searchResults = await index.query({
            topK: 5,
            vector: queryEmbeddings.data[0].embedding,
            includeMetadata: true,
            filter: { fileId: uploadId }
        })

        const contextText = searchResults.matches
            .map((m) => m.metadata?.text).join("\n\n")
        const systemPrompt = `
You are an expert summarizer and document assistant.
Answer based on this document content and previous summary.
Document Title: ${upload?.fileName}
Summary: ${upload?.summary}
Relevant Chunks:\n${contextText}
`;
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ]
        });
        const results = completion.choices[0].message?.content || "No response from LLM";

        res.status(200).json({
            success: true,
            message: "Response generated successfully",
            results
        })
    } catch (error) {
        console.log(error)
        next(errorHandler(500, "Failed to process conversation"))
    }
}