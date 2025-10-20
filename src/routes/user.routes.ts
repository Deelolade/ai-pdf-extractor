import express from 'express'
import { createUser, signInUser } from '../controllers/user.controller'

export const userRouter = express.Router()

userRouter.post('/register', createUser)
userRouter.post('/signin', signInUser)