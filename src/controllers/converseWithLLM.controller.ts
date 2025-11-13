import { NextFunction, Request, Response } from "express"
import { errorHandler } from "../utils/errorHandler"
import OpenAI from "openai";
import { apiKey, MAX_TRIALS, OPENAI_APIKEY, PINECONE_INDEX } from "../utils/env";
import { Upload } from "../models/upload.model";
import { pc } from "../utils/pinecone";
import { User } from "../models/user.model";
import { GoogleGenAI } from "@google/genai";

const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://openrouter.ai/api/v1",
})

const openaiEmbed = new OpenAI({
    apiKey: OPENAI_APIKEY
})
const geminiEmbed = new GoogleGenAI({})
export const converseWithLLM = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { uploadId } = req.params;
        const { message } = req.body;
        if (!message || !uploadId) {
            return next(errorHandler(400, "Message and Upload ID are required"))
        }
        const upload = await Upload.findOne({ _id: uploadId, userId: req.user?.id });
        if (!upload) {
            return next(errorHandler(404, "Upload not found !"))
        }
        const user = await User.findById(req.user?.id);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }
        if (!user.isPaidUser) {
            if (user.trialCount >= MAX_TRIALS) {
                return next(errorHandler(403, "Trial limit reached. Please upgrade to a paid account."));
            }

            user.trialCount += 1;
            await user.save()

            console.log("isPaidUser:", user.isPaidUser, "trialCount:", user.trialCount);
        }

        const responseEmbeddings = await geminiEmbed.models.embedContent({
            model: "gemini-embedding-001",
            contents: message
        })

        const index = pc.index(PINECONE_INDEX);

        if (!responseEmbeddings.embeddings) {
            return next(errorHandler(500, "Failed to generate embeddings"))
        }
        if (!responseEmbeddings.embeddings?.length) {
            return next(errorHandler(500, "Embedding array empty"));
        }
        const embeddings = responseEmbeddings.embeddings[0].values;
        if (!embeddings) {
            return next(errorHandler(500, "Failed to generate embeddings"));
        }
        const vector = embeddings


        const searchResults = await index.query({
            topK: 5,
            vector,
            includeMetadata: true,
            filter: { fileId: uploadId.toString() }
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
        // const updatedDocuments = await Upload.findByIdAndUpdate(uploadId, { summary: results }, { new: true });
        // Upload.wordCount = message.split(' ').length
        // await
        res.status(200).json({
            success: true,
            message: "Response generated successfully",
            results,
            // updatedDocuments: updatedDocuments?.summary
        })
    } catch (error) {
        console.log(error)
        next(errorHandler(500, "Failed to process conversation"))
    }
}