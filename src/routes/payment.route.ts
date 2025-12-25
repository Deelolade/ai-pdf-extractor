import express from "express";
import { flutterwaveWebhookHandler, initiateFlutterwavePayment, verifyPayment } from "../controllers/paymentContoller";
import { authenticateUser } from "../middleware/authMiddleware";

export const paymentRouter = express.Router();

paymentRouter.post('/initiate', authenticateUser, initiateFlutterwavePayment);
paymentRouter.get('/verify-payment', authenticateUser, verifyPayment);
paymentRouter.post('webhooks/flutterwave', flutterwaveWebhookHandler)
