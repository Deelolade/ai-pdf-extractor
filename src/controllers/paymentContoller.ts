import { NextFunction, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { errorHandler } from "../utils/errorHandler";
import { User } from "../models/user.model";
import { flw } from "../utils/flutterwave";
import { FLW_SECRET_KEY } from "../utils/env";
import { Payment, PaymentStatus } from "../models/payment.model";

dotenv.config();

export const initiateFlutterwavePayment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { amount, phone_number } = req.body;
    if (!amount || !phone_number) {
      return next(errorHandler(400, "Amount and phone number are required"))
    }
    const user = await User.findById(req.user?.id);
    if (!user) {
      return next(errorHandler(404, "User not found"))
    }
    const tx_ref = `tx-DocFeel-${Date.now()}`;
    const paymentPayload = {
      tx_ref,
      amount,
      currency: 'NGN',
      redirect_url: 'https://docfeel.com/verify-payment',
      payment_options: "card,banktransfer,ussd,qr,mobilemoney,opay",
      customer: {
        email: user.email,
        phonenumber: phone_number,
        name: user.name
      },
      customizations: {
        title: 'DocFeel Payment',
        description: 'Payment for DocFeel services',
      }
    }

    console.log("Initiating Flutterwave payment with payload:", paymentPayload);
    const response = await axios.post("https://api.flutterwave.com/v3/payments", paymentPayload, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json"
      }
    })
    console.log("Flutterwave payment initiation response:", response.data);

    await Payment.create({
      userId: user._id,
      amount,
      tx_ref,
      status: PaymentStatus.PENDING
    })
    res.status(200).json({
      success: true,
      link: response.data.data.link,
      tx_ref
    })
  } catch (error) {
    next(errorHandler(500, "Failed to initiate payment"))
  }
};

export const verifyPayment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { tx_ref, transaction_id } = req.query;
  const user = await User.findById(req.user?.id);
  if (!user) {
    return next(errorHandler(404, "User not found"))
  }
  try {
    if (!tx_ref || !transaction_id) {
      return next(errorHandler(400, "tx_ref and transaction_id are required"))
    }
    const payment = await Payment.findOne({ tx_ref, userId: user._id });

    if (!payment) {
      return next(errorHandler(404, "Payment record not found"));
    }

    if (payment?.status === "successful") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      })
    };

    const response = await axios.get(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json"
      }
    })
    console.log("Flutterwave payment verification response:", response.data);
    if (response.data.status !== 'success' || response.data.data.status !== 'successful') {
      await Payment.findOneAndUpdate({ tx_ref }, { status: PaymentStatus.FAILED });
      return next(errorHandler(400, "Payment verification failed"))

    }
    if (response.data.data.tx_ref !== tx_ref) {
      return next(errorHandler(400, "Transaction reference mismatch"));
    }

    if (Number(response.data.data.amount) !== Number(payment.amount)) {
      return next(errorHandler(400, "Payment amount mismatch"));
    }
    await Payment.findOneAndUpdate({ tx_ref }, { status: PaymentStatus.SUCCESSFUL });
    await User.findByIdAndUpdate(user._id, { isPaidUser: true, plan: 'premium', $inc: { credits: 50 }, });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: response.data.data
    })

  } catch (error) {
    next(errorHandler(500, "Failed to verify payment"))
  }
}

export const flutterwaveWebhookHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  console.log("Webhook received:", req.body);
  res.status(200).json({ success: true });
  try {
    const event = req.body.event;
    const data = req.body.data;

    const signature = req.headers["verif-hash"];
    if (signature !== process.env.FLW_WEBHOOK_SECRET) {
      return res.status(403).json({ success: false, message: "Invalid signature" });
    }

    if (event === 'charge.completed') {
      const { tx_ref, status, amount } = data;

      const payment = await Payment.findOne({ tx_ref });
      if (!payment) {
        return next(errorHandler(404, "Payment record not found"));
      }
      if (payment.status === PaymentStatus.SUCCESSFUL) {
        return res.status(200).json({ success: true, message: "Payment already processed" });
      }
      let paymentStatus = PaymentStatus.FAILED;
      if (status === "successful") {
        paymentStatus = PaymentStatus.SUCCESSFUL;
      }
      await Payment.findOneAndUpdate({ tx_ref }, { status: paymentStatus });

      if (paymentStatus === PaymentStatus.SUCCESSFUL) {
        await User.findByIdAndUpdate(payment.userId, {
          isPaidUser: true,
          plan: 'premium',
          $inc: { credits: 50 },
        });
        return res.status(200).json({
          success: true, message: "Payment processed successfully"
        })
      }
    }
    return res.status(200).json({ success: true, message: "Event ignored" });
  } catch (error) {
    next(error)
  }
}