import mongoose from "mongoose";
import { Document } from "mongoose";

export enum Role {
    USER = 'user',
    ASSISTANT = 'assistant'
}
interface chatMessage {
    role: Role;
    content: string;
    createdAt: Date
}
interface ChatDocument extends Document {
    userId: mongoose.Types.ObjectId,
    documentId: mongoose.Types.ObjectId,
    messages: chatMessage[];
    createdAt: Date;
    updatedAt: Date;
}


const chatMessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: [Role.USER, Role.ASSISTANT],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false })

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'upload',
        required: true
    },
    messages: {
        type: [chatMessageSchema],
        default: []
    }
}, { timestamps: true })

export const Chat = mongoose.model<ChatDocument>('chat', chatSchema)