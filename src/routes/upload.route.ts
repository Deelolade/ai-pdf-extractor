import express, { Response } from "express";
import { uploadPdf } from "../controllers/upload.controller";
import multer from "multer";

export const uploadRouter =express.Router();
const upload = multer({storage: multer.memoryStorage()});

uploadRouter.post('/',upload.single('file'), uploadPdf)