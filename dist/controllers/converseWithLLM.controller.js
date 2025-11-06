"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.converseWithLLM = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const openai_1 = __importDefault(require("openai"));
const env_1 = require("../utils/env");
const upload_model_1 = require("../models/upload.model");
const user_model_1 = require("../models/user.model");
const openai = new openai_1.default({
    apiKey: env_1.apiKey,
    baseURL: "https://openrouter.ai/api/v1",
});
const openaiEmbed = new openai_1.default({
    apiKey: env_1.OPENAI_APIKEY
});
const converseWithLLM = async (req, res, next) => {
    try {
        const { uploadId } = req.params;
        const { message } = req.body;
        if (!message || !uploadId) {
            return next((0, errorHandler_1.errorHandler)(400, "Message and Upload ID are required"));
        }
        const upload = await upload_model_1.Upload.findOne({ _id: uploadId, userId: req.user?.id });
        if (!upload) {
            return next((0, errorHandler_1.errorHandler)(404, "Upload not found !"));
        }
        const user = await user_model_1.User.findById(req.user?.id);
        if (!user) {
            return next((0, errorHandler_1.errorHandler)(404, "User not found"));
        }
        // const queryEmbeddings = await openaiEmbed.embeddings.create({
        //     model: "text-embedding-3-small",
        //     input: message
        // })
        // const index = pc.index(PINECONE_INDEX);
        // if (!queryEmbeddings?.data?.[0]?.embedding) {
        //     return next(errorHandler(500, "Failed to generate embeddings"))
        // }
        // console.log("Embedding length:", queryEmbeddings.data[0].embedding.length);
        // const searchResults = await index.query({
        //     topK: 5,
        //     vector: queryEmbeddings.data[0].embedding,
        //     includeMetadata: true,
        //     filter: { fileId: uploadId }
        // })
        // const contextText = searchResults.matches
        //     .map((m) => m.metadata?.text).join("\n\n")
        const systemPrompt = `
You are an expert summarizer and document assistant.
Answer based on this document content and previous summary.
Document Title: ${upload?.fileName}
Summary: ${upload?.summary}
`;
        // Relevant Chunks:\n${contextText}
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ]
        });
        const results = completion.choices[0].message?.content || "No response from LLM";
        const updatedDocuments = await upload_model_1.Upload.findByIdAndUpdate(uploadId, { summary: results }, { new: true });
        if (!user.isPaidUser) {
            if (user.trialCount >= env_1.MAX_TRIALS) {
                return next((0, errorHandler_1.errorHandler)(403, "Trial limit reached. Please upgrade to a paid account."));
            }
            user.trialCount += 1;
            await user.save();
            console.log("isPaidUser:", user.isPaidUser, "trialCount:", user.trialCount);
        }
        res.status(200).json({
            success: true,
            message: "Response generated successfully",
            // results,
            updatedDocuments: updatedDocuments?.summary
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "Failed to process conversation"));
    }
};
exports.converseWithLLM = converseWithLLM;
