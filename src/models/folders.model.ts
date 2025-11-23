import mongoose, { Document, model, Schema } from "mongoose";

export interface FolderDocument extends Document{
    name: string;
    userId: mongoose.Types.ObjectId;
    documentIds: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
const folderSchema = new Schema<FolderDocument>({
    name:{
        type: String,
        required: true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required: true,
    },
    documentIds:[{
        type:Schema.Types.ObjectId,
        ref:'upload',
    }],
    updatedAt:{
        type:Date,
        default: Date.now
    }
}, { timestamps: true })
export const Folder = model<FolderDocument>('folder', folderSchema);