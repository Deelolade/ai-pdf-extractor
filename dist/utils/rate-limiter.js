"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserFoldersLimiter = exports.removeDocumentFromFolderLimiter = exports.addDocumentToFolderLimiter = exports.createFolderLimiter = exports.updateDocumentLimiter = exports.converseRateLimiter = exports.deleteUploadLimiter = exports.getAllUploadsLimiter = exports.createSummaryLimiter = exports.createUploadLimiter = exports.forgotPasswordLimiter = exports.registerLimiter = exports.passwordResetLimiter = exports.loginLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Login limiter - strict to prevent brute force
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 5, // max 5 attempts per IP
    message: "Too many login attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
// Password reset limiter - prevent abuse of reset requests
exports.passwordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 5, // max 5 attempts per IP
    message: "Too many password reset attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
// Registration limiter - more lenient to allow legitimate signups but prevent bots
exports.registerLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20, // max 20 attempts per IP
    message: "Too many registration attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
// Forgot password limiter - similar to password reset
exports.forgotPasswordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 5, // max 5 attempts per IP
    message: "Too many password reset requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
exports.createUploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    message: "Too many upload requests. Please wait a bit before uploading again.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
exports.createSummaryLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    message: "Too many create summary requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
exports.getAllUploadsLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 50,
    message: "Too many requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
exports.deleteUploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    message: "Too many delete requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
exports.converseRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    message: "Too many chat requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
exports.updateDocumentLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    message: "Too many update requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
exports.createFolderLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    message: "Too many create folder requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
exports.addDocumentToFolderLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    message: "Too many add document to folder requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
exports.removeDocumentFromFolderLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    message: "Too many attempt to remove document from folder requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
exports.getAllUserFoldersLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    message: "Too many attempt to get user document in a folder requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
});
