import { Request } from "express";
import 'express';
import { JwtPayload } from 'jsonwebtoken';


export interface RequestWithFile extends Request {
  file?: Express.Multer.File; // ✅ Use built-in type
}

declare module 'express' {
  interface Request {
    user?: JwtPayload; // or your custom user type
  }
}