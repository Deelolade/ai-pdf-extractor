import chalk from "chalk"
import bcrypt from "bcryptjs"
import { NextFunction, Request, Response } from "express"
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "../utils/env";
import { errorHandler } from "../utils/errorHandler";


export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next(errorHandler(400, "All fields are required !!"))

        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, "User already existed !"))

        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });
        const token = jwt.sign(
            {
                id: newUser._id,
                email: newUser.email
            },
            JWT_TOKEN,
            { expiresIn: "7d" }
        )
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            token
        })

    } catch (error) {
        next(errorHandler(500, "Error occured while saving user to database"))
    }
}
export const signInUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { email, password } = req.body;
    if (!email || !password) {
       return next(errorHandler(400, "All fields are required !!"))
    }
    try {
        const validUser = await User.findOne({email})
        if(!validUser){
            return next(errorHandler(400, "User not found"))
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(400, "Invalid Credentials"))
        }
        const token = jwt.sign(
            {id:validUser._id,email:validUser.email},
            JWT_TOKEN,
            {expiresIn:"7d"}
        )
        res.status(200).json({
            success:true,
            message:"Signed in successfully",
            user:{ id:validUser._id, name:validUser.name, email:validUser.email},
            token
        })
        
    } catch (error) {
        console.log(error)
        next(errorHandler(500, "Error occured while signing in"))
    }
}