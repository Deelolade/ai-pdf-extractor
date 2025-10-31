import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import { title } from "process";
import { flw } from "../utils/flutterwave";
import { FRONTEND_URL } from "../utils/env";

export const initiatePayments = async ( req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, email, name } = req.body;
        if(!amount || !email || !name){
            return next(errorHandler(400, "Amount, email and name are required"))
        }
        const tx_ref = `tx-${Date.now()}.${Math.ceil(Math.random() * 1000)}`;
         const payload = {
            // tx_ref: tx_ref,
            amount,
            name: "PDF Extractor Pro",
            currency: "NGN",
            interval: 'monthly',
            // redirect_url: `${FRONTEND_URL}/payment-callback`,
            // customer:{
            //     name,
            //     email,
            //     phone_number: "08012345678"
            // },
            // customizations:{
            //     title: "PDF Extractor Pro",
            //     description: "Payment for PDF Extractor Pro Subscription"
            // }
        }
        console.log(payload)
        const response = await  flw.PaymentPlan.create(payload);
        console.log("response:", response)
        res.status(200).json({
            message: "Payment initiated successfully",
            link: response.data.link
        })
    } catch (error) {
        console.log("error from initating payments:", error)
        next(errorHandler(500, "Error occured while initiating payment"))
    }
}