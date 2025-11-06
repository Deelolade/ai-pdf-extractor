"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../utils/env");
const authenticateUser = async (req, res, next) => {
    console.log("cookies", req.cookies.access_token);
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.access_token;
        if (!token) {
            return next((0, errorHandler_1.errorHandler)(401, "Authentication token is missing !!"));
        }
        req.user = jsonwebtoken_1.default.verify(token, env_1.JWT_TOKEN);
        next();
    }
    catch (error) {
        console.log(error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next((0, errorHandler_1.errorHandler)(401, "Token expired. Please log in again."));
        }
        return next((0, errorHandler_1.errorHandler)(401, "Invalid token."));
    }
};
exports.authenticateUser = authenticateUser;
