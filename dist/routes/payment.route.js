"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = __importDefault(require("express"));
const paymentContoller_1 = require("../controllers/paymentContoller");
exports.paymentRouter = express_1.default.Router();
exports.paymentRouter.post('/initiate', paymentContoller_1.initiateFlutterwavePayment);
exports.paymentRouter.get('/verify-payment', paymentContoller_1.verifyPayment);
