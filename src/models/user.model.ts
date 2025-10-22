import mongoose, { Document, Schema } from "mongoose";

interface UserDocument extends Document{
    name: string,
    email: string,
    password: string
    passwordResetTokenHash?:string
    passwordResetExpiresAt?:Date
    passwordChangedAt :Date
}
const UserSchema = new Schema<UserDocument>({
    name:{
        type:String,
        required: true
    },
    email:{
        required:true,
        unique: true,
        type: String
    },
    password: {
        required: true,
        type:String
    },
    passwordResetTokenHash:{
        type:String
    },
    passwordResetExpiresAt:{
        type:Date,
        default: undefined,
    },
    passwordChangedAt:{
        type:Date,
    }
}, {timestamps:true})

export const User = mongoose.model<UserDocument>('user',UserSchema)