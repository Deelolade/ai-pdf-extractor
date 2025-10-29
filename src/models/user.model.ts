import mongoose, { Document, Schema } from "mongoose";

enum userPlan {
    MONTHLY= "monthly",
    STUDENT= "student",
    FREE= "free"
}
interface UserDocument extends Document {
    name: string,
    email: string,
    password: string
    trialCount: number
    isPaidUser: boolean
    passwordResetTokenHash?: string
    passwordResetExpiresAt?: Date
    passwordChangedAt: Date
    passwordHistory: Array<{
        hash: string,
        changedAt: Date
    }>
    plan?: userPlan
    subscriptionId?: string; // from Flutterwave, Paystack, or Stripe
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date; // auto-renew date
    autoRenew?: boolean; // helps track recurring billing

}
const UserSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: true
    },
    email: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    trialCount: {
        default: 0,
        type: Number
    },
    isPaidUser: {
        type: Boolean,
        default: false
    },
    passwordResetTokenHash: {
        type: String
    },
    passwordResetExpiresAt: {
        type: Date,
        default: undefined,
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordHistory: [
        {
            hash: String,
            changedAt: Date
        }
    ],
    plan:{
        type: String
    },
    subscriptionId:{
        type: String
    },
    subscriptionStartDate:{
        type :Date
    },
    subscriptionEndDate:{
        type :Date
    },
    autoRenew:{
        type:Boolean,
        default:true
    }
}, { timestamps: true })

export const User = mongoose.model<UserDocument>('user', UserSchema)