import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const initiateFlutterwavePayment = async (req: Request, res: Response) => {
  try {
    const { amount, email, name, phone } = req.body;

    const payload = {
      tx_ref: "tx-" + Date.now(),
      amount,
      currency: "NGN",
      redirect_url: "https://b8208fe24eee.ngrok-free.app/verify-payment",
      payment_options: "card, banktransfer, ussd, qr, mobilemoney, opay",
      customer: {
        email,
        phonenumber: phone,
        name,
      },
      customizations: {
        title: "My Store",
        description: "Payment for items in cart",
      },
    };

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // The Flutterwave checkout link
    const paymentLink = response.data.data.link;

    res.json({ paymentLink });
  } catch (error: any) {
    console.error("Error initiating payment:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};

export const  verifyPayment = async (req: Request, res: Response) => {
    const { tx_ref } = req.params;

    res.send("Payment verified successfully");
    console.log(tx_ref)
}