import mongoose, { Document, model, Schema } from "mongoose";

export enum PaymentStatus{
    PENDING= 'pending',
    SUCCESSFUL= 'successful',
    FAILED= 'failed'
}
export interface PaymentDocument extends Document{
    userId: mongoose.Types.ObjectId;
    amount: number;
    tx_ref: string;
    status: PaymentStatus;
    phoneNumber?: string;
    currency?: string;
    createdAt: Date;
    updatedAt: Date;
}
const paymentSchema = new Schema<PaymentDocument>({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    tx_ref: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    status:{
        default: PaymentStatus.PENDING,
        type: String,
        required: true,
        enum: ['pending', 'successful', 'failed']
    },
    phoneNumber:{
        type: String,
    },
    currency:{
        type: String,
    }
}, { timestamps: true })
export const Payment = model<PaymentDocument>('payment', paymentSchema);