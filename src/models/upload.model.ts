import mongoose, { Schema, } from "mongoose";

interface UploadDocument extends mongoose.Document{
    userId: mongoose.Types.ObjectId;
    fileName: string;
    fileUrl: string;
    textExtracted: string;
    summary?: string;
    wordCount?: number;
    processedAt?: Date;
}
const uploadSchema = new mongoose.Schema<UploadDocument>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true
    },
    fileName:{
        type:String,
        required:true
    },
    fileUrl:{
        type:String,
        required:true
    },
    summary:{
        type:String,
    },
    wordCount:{
        type:Number,
    },
    textExtracted:{
        type:String,
        require:true
    },
    processedAt:{
        type: Date,
        default: Date.now
    }
}, {timestamps:true})

export const Upload = mongoose.model<UploadDocument>('upload',uploadSchema); 