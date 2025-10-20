import chalk from "chalk"
import bcrypt from "bcryptjs"
import { NextFunction, Request, Response } from "express"
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "../utils/env";


export const createUser = async(req:Request, res:Response, next:NextFunction): Promise<void> =>{

   try {
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        res.status(400).json({message: 'all fields are required !!'})
        return;
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        res.status(400).json({message: 'User already existed!!'})
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email, 
        password:hashedPassword
    });
    const token = jwt.sign(
        { id:newUser._id,
        email:newUser.email},
        JWT_TOKEN,
        {expiresIn:"7d"}
        )
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        user:{ id: newUser._id, 
            name:newUser.name,
            email:newUser.email
        },
        token
    })

   } catch (error) {
    res.status(500).json({
        success: false,
        message: `error occured while saving user to database`
    })
    next()
   }
}
export const signInUser = async(req:Request, res:Response, next:NextFunction):Promise<void>=>{

    const { email, password} = req.body

}