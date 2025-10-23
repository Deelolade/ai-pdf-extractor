import { NextFunction, Response } from "express";
import { RequestWithFile } from "../types/express";
import { errorHandler } from "../utils/errorHandler";
import cloudinary from "../utils/cloudinary";
import { extractTextFromPdf } from "../utils/pdfExtractor";
const { PDFParse } = require('pdf-parse');

export const uploadPdf = async(req:RequestWithFile, res:Response, next:NextFunction)=>{
      console.log("file received:", req.file);

      try {
    if (!req.file) {
      return next(errorHandler(400, "No file uploaded"));
    }

    // 1️⃣ Upload PDF to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
    });

    const fileUrl = cloudinaryResult.secure_url;
    console.log("File uploaded to Cloudinary:", fileUrl);

    // 2️⃣ Parse PDF text directly from Cloudinary URL
    const parser = new PDFParse({ url: fileUrl });
    const result = await parser.getText();

    // 3️⃣ Respond with extracted text
    res.status(200).json({
      message: "Text extracted successfully",
      text: result.text,
    });
     } catch (error) {
        console.error("Upload error:", error);
        next(errorHandler(500, "filed to upload pdf"))
     }
}