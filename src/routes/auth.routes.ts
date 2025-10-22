import express from 'express'
import { createUser, forgetPassword, resetPassword, signInUser } from '../controllers/auth.controller'
import { forgotPasswordLimiter, loginLimiter, passwordResetLimiter, registerLimiter } from '../utils/rate-limiter'

export const userRouter = express.Router()

userRouter.post('/register',registerLimiter, createUser)
userRouter.post('/signin', loginLimiter, signInUser)
userRouter.post('/forgot-password',forgotPasswordLimiter, forgetPassword)
userRouter.post('/reset-password', passwordResetLimiter, resetPassword)