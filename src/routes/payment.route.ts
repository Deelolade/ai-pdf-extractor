import express from "express";
import { initiatePayments } from "../controllers/paymentContoller";

export const paymentRouter = express.Router();

paymentRouter.post('/initiate', initiatePayments);
