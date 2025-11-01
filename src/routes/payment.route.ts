import express from "express";
import { initiateFlutterwavePayment, verifyPayment } from "../controllers/paymentContoller";

export const paymentRouter = express.Router();

paymentRouter.post('/initiate', initiateFlutterwavePayment);
paymentRouter.get('/verify-payment', verifyPayment);
