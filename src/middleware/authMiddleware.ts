import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import jwt from "jsonwebtoken";
import { JWT_TOKEN } from "../utils/env";

export const authenticateUser = async(req:Request, res:Response, next: NextFunction)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

        if(!token){
            return next(errorHandler(401, "Authentication token is missing !!"))
        }
        req.user =  jwt.verify(token, JWT_TOKEN) as jwt.JwtPayload;
        
        next();
    } catch (error) {
        console.log(error)
        next(errorHandler(401, "Invalid or expired token !!"))
    }
}