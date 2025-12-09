"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const rate_limiter_1 = require("../utils/rate-limiter");
const authMiddleware_1 = require("../middleware/authMiddleware");
exports.userRouter = express_1.default.Router();
/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get the currently authenticated user
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []   # or whatever auth scheme you use (JWT, cookie, etc.)
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                 isPaid:
 *                   type: boolean
 *                 trialCount:
 *                   type: integer
 *       401:
 *         description: Unauthorized (user not logged in)
 *       500:
 *         description: Internal server error
 */
exports.userRouter.get('/me', authMiddleware_1.authenticateUser, auth_controller_1.getUserData);
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Internal server error (e.g., database failure)
 */
exports.userRouter.post('/register', rate_limiter_1.registerLimiter, auth_controller_1.createUser);
/**
 * @openapi
 * /api/auth/signin:
 *   post:
 *     summary: sign in a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Internal server error (e.g., database failure)
 */
exports.userRouter.post('/signin', rate_limiter_1.loginLimiter, auth_controller_1.signInUser);
exports.userRouter.post('/logout', rate_limiter_1.loginLimiter, auth_controller_1.logOutUser);
/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       400:
 *         description: Bad request (e.g., missing or invalid email)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
exports.userRouter.post('/forgot-password', rate_limiter_1.forgotPasswordLimiter, auth_controller_1.forgetPassword);
/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token sent to user's email
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request (e.g., missing fields, invalid token)
 *       404:
 *         description: Token or user not found
 *       500:
 *         description: Internal server error
 */
exports.userRouter.post('/reset-password/:token', rate_limiter_1.passwordResetLimiter, auth_controller_1.resetPassword);
