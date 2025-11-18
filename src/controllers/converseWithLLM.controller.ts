import { NextFunction, Request, Response } from "express"
import { errorHandler } from "../utils/errorHandler"
import OpenAI from "openai";
import { apiKey, MAX_TRIALS, OPENAI_APIKEY, PINECONE_INDEX } from "../utils/env";
import { Upload } from "../models/upload.model";
import { pc } from "../utils/pinecone";
import { User } from "../models/user.model";
import { GoogleGenAI } from "@google/genai";
import { Chat, Role } from "../models/chat.model";
import { Messages } from "openai/resources/chat/completions";

const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://openrouter.ai/api/v1",
})

const openaiEmbed = new OpenAI({
    apiKey: OPENAI_APIKEY
})
const geminiEmbed = new GoogleGenAI({});

export const converseWithLLM = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { documentId } = req.params;
        const { message } = req.body;
        const userId = req.user?.id;
        console.log(userId)
        console.log(documentId, message)
        if (!message || !documentId) {
            return next(errorHandler(400, "Message and Document id are required"))
        }
        const upload = await Upload.findOne({ _id: documentId, userId});
        if (!upload) {
            return next(errorHandler(404, "Document not found !"))
        }
        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
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
            ]
        });
        const aiReply = completion.choices[0].message?.content || "No response from LLM";

        const newMessages = [
            // ...messages,
            {
                role: Role.USER,
                content:message,
                createdAt: new Date,
            },
            {
                role: Role.ASSISTANT,
                content:aiReply,
                createdAt: new Date,
            }
        ]

        let chat = await Chat.findOne({ userId, documentId});

        if(chat){
            chat.messages.push(...newMessages);
            await chat.save();
        }else{
            chat = await  Chat.create({
                userId,
                documentId,
                messages: newMessages
            })  
    
        }
        res.status(200).json({
            success: true,
            message: "Response generated successfully",
            chat,
            reply:aiReply
        })
    } catch (error) {
        console.log(error)
        next(errorHandler(500, "Failed to process conversation"))
    }
}

export const getAllChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const { documentId } = req.params;
    const userId = req.user?.id
    if(!documentId){
        return  next(errorHandler(400, 'Document Id is required '))
    }

    const previousChat = await Chat.findOne({ documentId, userId})
    
    if(!previousChat){
        res.status(200).json({
            success: true,
            messages: [],
            info: "No chat record found !"
        })
    }
    res.status(200).json({
        success: true,
        messages: previousChat?.messages
    })
    } catch (error) {
        next(errorHandler(500, 'Unable to get previous conversations !!'))
    }

}