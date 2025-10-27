import { NextFunction, Request, Response } from "express"
import { errorHandler } from "../utils/errorHandler"
import OpenAI from "openai";
import { apiKey } from "../utils/env";
import { Upload } from "../models/upload.model";

const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://openrouter.ai/api/v1",
})
export const converseWithLLM = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { uploadId } = req.params;
        const { message } = req.body;
        if (!message || !uploadId) {
            return next(errorHandler(400, "Message and Upload ID are required"))
        }
        const upload = await Upload.findOne({ _id: uploadId, userId: req.user?.id });

        const context = upload
            ? `The user is asking about a document titled "${upload.fileName}". Here is its summary:\n${upload.summary}\n\nNow answer the user's question clearly and concisely.`
            : "You are an assistant that helps users analyze and summarize PDFs they have uploaded.";

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: context },
                { role: "user", content: message }
            ]
        });
        const results = completion.choices[0].message?.content || "No response from LLM";

        res.status(200).json({
            success: true,
            message:"Response generated successfully",
            results
        })
    } catch (error) {
        console.log(error)
        next(errorHandler(500, "Failed to process conversation"))
    }
}