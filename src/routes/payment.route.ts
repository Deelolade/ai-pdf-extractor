import express from "express";
import { flutterwaveWebhookHandler, getPaymentStatus, initiateFlutterwavePayment, verifyPayment } from "../controllers/paymentContoller";
import { authenticateUser } from "../middleware/authMiddleware";
import { getPaymentstatusLimiter } from "../utils/rate-limiter";

export const paymentRouter = express.Router();

paymentRouter.post('/initiate', authenticateUser, initiateFlutterwavePayment);
paymentRouter.get('/verify-payment', authenticateUser, verifyPayment);
paymentRouter.post('/webhooks/flutterwave', flutterwaveWebhookHandler)
paymentRouter.get('/status', getPaymentStatus)
