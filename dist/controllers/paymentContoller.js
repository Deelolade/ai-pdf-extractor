"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.initiateFlutterwavePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const initiateFlutterwavePayment = async (req, res) => {
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
        const response = await axios_1.default.post("https://api.flutterwave.com/v3/payments", payload, {
            headers: {
                Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });
        // The Flutterwave checkout link
        const paymentLink = response.data.data.link;
        res.json({ paymentLink });
    }
    catch (error) {
        console.error("Error initiating payment:", error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
};
exports.initiateFlutterwavePayment = initiateFlutterwavePayment;
const verifyPayment = async (req, res) => {
    const { tx_ref } = req.params;
    res.send("Payment verified successfully");
    console.log(tx_ref);
};
exports.verifyPayment = verifyPayment;
