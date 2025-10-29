import { NextFunction, Request, Response } from "express";
import { MAX_TRIALS } from "../utils/env";
import { errorHandler } from "../utils/errorHandler";
import { User } from "../models/user.model";

export const checkSubscription = async (req: Request, res: Response, next: NextFunction) => {
    const now = new Date();
    const user = await User.findById(req.user?.id);
    if (!user) {
        return next(errorHandler(404, "User not found"));
    }

    if (!user.isPaidUser) {
        if (user.trialCount >= MAX_TRIALS) {
            return next(errorHandler(403, "Trial limit reached. Please upgrade to a paid account."));
        }
        user.trialCount += 1;
        await user.save();
    } else {
        if (!user.subscriptionEndDate || user.subscriptionEndDate < now) {
            user.isPaidUser = false;
            await user.save();
            return next(errorHandler(403, "Your subscription has expired. Please renew to continue."));
        }
    }
    next();
} 