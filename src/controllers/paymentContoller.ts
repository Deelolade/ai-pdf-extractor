import { NextFunction, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { errorHandler } from "../utils/errorHandler";
import { User } from "../models/user.model";
import { flw } from "../utils/flutterwave";
import { FLW_SECRET_KEY } from "../utils/env";

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
  try {
    if (!tx_ref || !transaction_id) {
      return next(errorHandler(400, "tx_ref and transaction_id are required"))
    }

    const response = await axios.get(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json"
      }
    })
    console.log("Flutterwave payment verification response:", response.data);
    if(response.data.status === 'success' && response.data.data.status === 'successful') {
      // Payment successful, update user subscription or access here

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: response.data.data
      })
    }
  } catch (error) {
    next(errorHandler(500, "Failed to verify payment"))
  }


}