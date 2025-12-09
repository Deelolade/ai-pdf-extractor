"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllChats = exports.converseWithLLM = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const openai_1 = __importDefault(require("openai"));
const env_1 = require("../utils/env");
const upload_model_1 = require("../models/upload.model");
const user_model_1 = require("../models/user.model");
const genai_1 = require("@google/genai");
const chat_model_1 = require("../models/chat.model");
const openai = new openai_1.default({
    apiKey: env_1.apiKey,
    baseURL: "https://openrouter.ai/api/v1",
});
const openaiEmbed = new openai_1.default({
    apiKey: env_1.OPENAI_APIKEY
});
const geminiEmbed = new genai_1.GoogleGenAI({});
const converseWithLLM = async (req, res, next) => {
    try {
        const { documentId } = req.params;
        const { message } = req.body;
        const userId = req.user?.id;
        console.log(userId);
        console.log(documentId, message);
        if (!message || !documentId) {
            return next((0, errorHandler_1.errorHandler)(400, "Message and Document id are required"));
        }
        const upload = await upload_model_1.Upload.findOne({ _id: documentId, userId });
        if (!upload) {
            return next((0, errorHandler_1.errorHandler)(404, "Document not found !"));
        }
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            return next((0, errorHandler_1.errorHandler)(404, "User not found"));
        }
        // if (!user.isPaidUser) {
        //     if (user.trialCount >= MAX_TRIALS) {
        //         return next(errorHandler(403, "Trial limit reached. Please upgrade to a paid account."));
        //     }
        //     user.trialCount += 1;
        //     await user.save()
        //     console.log("isPaidUser:", user.isPaidUser, "trialCount:", user.trialCount);
        // }
        const systemPrompt = `
You are a helpful assistant. 
Answer the user's questions based ONLY on the document content below. 
Do not invent information. 

Document:
${upload.textExtracted}
`;
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            max_tokens: 2000
        });
        const aiReply = completion.choices[0].message?.content || "No response from LLM";
        const newMessages = [
            // ...messages,
            {
                role: chat_model_1.Role.USER,
                content: message,
                createdAt: new Date,
            },
            {
                role: chat_model_1.Role.ASSISTANT,
                content: aiReply,
                createdAt: new Date,
            }
        ];
        let chat = await chat_model_1.Chat.findOne({ userId, documentId });
        if (chat) {
            chat.messages.push(...newMessages);
            await chat.save();
        }
        else {
            chat = await chat_model_1.Chat.create({
                userId,
                documentId,
                messages: newMessages
            });
        }
        res.status(200).json({
            success: true,
            message: "Response generated successfully",
            chat,
            reply: aiReply
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "Failed to process conversation"));
    }
};
exports.converseWithLLM = converseWithLLM;
const getAllChats = async (req, res, next) => {
    try {
        const { documentId } = req.params;
        const userId = req.user?.id;
        if (!documentId) {
            return next((0, errorHandler_1.errorHandler)(400, 'Document Id is required '));
        }
        const previousChat = await chat_model_1.Chat.findOne({ documentId, userId });
        if (!previousChat) {
            res.status(200).json({
                success: true,
                messages: [],
                info: "No chat record found !"
            });
        }
        res.status(200).json({
            success: true,
            messages: previousChat?.messages
        });
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, 'Unable to get previous conversations !!'));
    }
};
exports.getAllChats = getAllChats;
