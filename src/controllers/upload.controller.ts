import { NextFunction, Response } from "express";
import { RequestWithFile } from "../types/express";
import { errorHandler } from "../utils/errorHandler";
import cloudinary from "../utils/cloudinary";
import { extractTextFromPdf } from "../utils/pdfExtractor";
import { uploadToR2 } from "../utils/r2Upload";
const { PDFParse } = require('pdf-parse');

export const uploadPdf = async(req:RequestWithFile, res:Response, next:NextFunction)=>{
      console.log("file received:", req.file);

      try {
    if (!req.file) {
      return next(errorHandler(400, "No file uploaded"));
    }

    console.log("Uploading to R2...");
    const fileUrl = await uploadToR2(req.file.path, req.file.filename);

    console.log("Extracting text...");
    const extractedText = await extractTextFromPdf(fileUrl);

    console.log("Extracted Text:", extractedText);
    
    res.status(200).json({
      message: "Text extracted successfully",
      fileUrl,
      text: extractedText,
    });
     } catch (error) {
        console.error("Upload error:", error);
        next(errorHandler(500, "filed to upload pdf"))
     }
}