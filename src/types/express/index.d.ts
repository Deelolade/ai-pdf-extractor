import { Request } from "express";

export interface RequestWithFile extends Request {
  file?: Express.Multer.File; // ✅ Use built-in type
}