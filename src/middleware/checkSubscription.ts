import { NextFunction, Request, Response } from "express";
import { MAX_TRIALS } from "../utils/env";
import { errorHandler } from "../utils/errorHandler";
import { User, userPlan } from "../models/user.model";

export const checkSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        // console.log(req)
        if (!userId) {
            return next(errorHandler(401, "Unauthorized: User ID missing"));
        }
        const now = new Date();
        const user = await User.findById(userId);
        
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        // TRIAL USER
        if (!user.isPaidUser) {
            if (user.trialCount >= MAX_TRIALS) {
                return next(errorHandler(403, "Trial limit reached. Please upgrade to a paid account."));
            }
        } 
        // PAID USER
        else {
            if (!user.subscriptionEndDate || user.subscriptionEndDate < now) {
                return next(errorHandler(403, "Subscription has expired. Please renew your subscription."));
            }
            if (user.credits <= 0) {
                return next(errorHandler(403, "Insufficient credits. Please purchase more credits to continue."));
            } else {
                if( user.trialCount >= MAX_TRIALS){
                    return next(errorHandler(403, "Trial limit reached. Please upgrade to a paid account."));
                }
            }
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in checkSubscription:", error);
        next(errorHandler(500, "Internal server error in subscription check"));
    }
} 
