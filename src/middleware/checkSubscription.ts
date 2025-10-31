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

        if (!user.isPaidUser) {
            // TRIAL USER
            if (user.trialCount >= MAX_TRIALS) {
                return next(errorHandler(403, "Trial limit reached. Please upgrade to a paid account."));
            }
        } 
        else {
            // PAID USER
            if (!user.subscriptionEndDate || user.subscriptionEndDate < now) {
                user.isPaidUser = false;
                user.plan = userPlan.FREE;
                await user.save();
                return next(errorHandler(403, "Your subscription has expired. Please renew to continue."));
            }

            const currentCredits = user.credits ?? 0 
            if(currentCredits <= 0){
                return next(errorHandler(403, "Insufficient credits. Please top up your account."));
            }

            user.credits = currentCredits - 1 ;
            await user.save();
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in checkSubscription:", error);
        next(errorHandler(500, "Internal server error in subscription check"));
    }
} 
