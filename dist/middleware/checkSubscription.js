"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSubscription = void 0;
const env_1 = require("../utils/env");
const errorHandler_1 = require("../utils/errorHandler");
const user_model_1 = require("../models/user.model");
const checkSubscription = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        // console.log(req)
        if (!userId) {
            return next((0, errorHandler_1.errorHandler)(401, "Unauthorized: User ID missing"));
        }
        const now = new Date();
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            return next((0, errorHandler_1.errorHandler)(404, "User not found"));
        }
        if (!user.isPaidUser) {
            // TRIAL USER
            if (user.trialCount >= env_1.MAX_TRIALS) {
                return next((0, errorHandler_1.errorHandler)(403, "Trial limit reached. Please upgrade to a paid account."));
            }
        }
        else {
            // PAID USER
            if (!user.subscriptionEndDate || user.subscriptionEndDate < now) {
                user.isPaidUser = false;
                user.plan = user_model_1.userPlan.FREE;
                await user.save();
                return next((0, errorHandler_1.errorHandler)(403, "Your subscription has expired. Please renew to continue."));
            }
            const currentCredits = user.credits ?? 0;
            if (currentCredits <= 0) {
                return next((0, errorHandler_1.errorHandler)(403, "Insufficient credits. Please top up your account."));
            }
            user.credits = currentCredits - 1;
            await user.save();
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Error in checkSubscription:", error);
        next((0, errorHandler_1.errorHandler)(500, "Internal server error in subscription check"));
    }
};
exports.checkSubscription = checkSubscription;
