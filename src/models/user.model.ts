import mongoose, { Document, Schema } from "mongoose";

interface UserDocument extends Document{
    name: string,
    email: string,
    password: string
    trialCount:number
    isPaidUser:boolean
    passwordResetTokenHash?:string
    passwordResetExpiresAt?:Date
    passwordChangedAt :Date
    passwordHistory: Array<{
        hash: string,
        changedAt: Date
    }>
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
    trialCount:{
        default:0,
        type:Number
    },
    isPaidUser:{
        type:Boolean,
        default:false
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
    },
    passwordHistory: [
  {
    hash: String,
    changedAt: Date
  }
]
}, {timestamps:true})

export const User = mongoose.model<UserDocument>('user',UserSchema)