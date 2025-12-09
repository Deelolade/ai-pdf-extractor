import express from 'express'
import { createUser, forgetPassword, getUserData, logOutUser, resetPassword, signInUser } from '../controllers/auth.controller'
import { forgotPasswordLimiter, loginLimiter, passwordResetLimiter, registerLimiter } from '../utils/rate-limiter'
import { authenticateUser } from '../middleware/authMiddleware'

export const userRouter = express.Router()

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

userRouter.get('/me',authenticateUser,getUserData)
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

userRouter.post('/register', registerLimiter, createUser)
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

userRouter.post('/signin', loginLimiter, signInUser)

userRouter.post('/logout', loginLimiter, logOutUser)

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
userRouter.post('/forgot-password', forgotPasswordLimiter, forgetPassword)
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
userRouter.post('/reset-password/:token', passwordResetLimiter, resetPassword)