import express from 'express'
import { createUser, forgetPassword, signInUser } from '../controllers/auth.controller'

export const userRouter = express.Router()

userRouter.post('/register', createUser)
userRouter.post('/signin', signInUser)
userRouter.post('/forgot-password', forgetPassword)