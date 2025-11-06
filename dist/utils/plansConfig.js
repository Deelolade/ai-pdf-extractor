"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLANS = void 0;
const env_1 = require("./env");
exports.PLANS = {
    ['userPlan.FREE']: {
        name: "Free plan",
        credits: 0,
        durationDays: 0,
        price: 0,
        MAX_TRIALS: env_1.MAX_TRIALS
    },
    ['userPlan.STUDENT']: {
        name: "Student plan",
        credits: 50,
        durationDays: 30,
        price: 2500
    },
    ['userPlan.MONTHLY']: {
        name: "monthly plan",
        credits: 100,
        durationDays: 30,
        price: 5000
    }
};
