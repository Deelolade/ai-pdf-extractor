import express, { Response } from "express";
import { uploadPdf } from "../controllers/upload.controller";
import multer from "multer";

export const uploadRouter =express.Router();
const upload = multer({dest: 'uploads/'})

uploadRouter.post('/',upload.single('resume'), uploadPdf)