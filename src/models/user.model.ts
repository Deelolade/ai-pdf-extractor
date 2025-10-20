import mongoose, { Document, Schema } from "mongoose";

interface UserDocument extends Document{
    name: string,
    email: string,
    password: string
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
    }
}, {timestamps:true})

export const User = mongoose.model<UserDocument>('user',UserSchema)