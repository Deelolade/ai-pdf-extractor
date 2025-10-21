import { NextFunction, Response } from "express";
import { RequestWithFile } from "../types/express";
import { errorHandler } from "../utils/errorHandler";
import cloudinary from "../utils/cloudinary";
import { extractTextFromPdf } from "../utils/pdfExtractor";

export const uploadPdf = async(req:RequestWithFile, res:Response, next:NextFunction)=>{
      console.log("file received:", req.file);

     try {
        if(!req.file){
            next(errorHandler(400, "No file uploaded"))
        }
        const cloudinaryResult = await cloudinary.uploader.upload(req.file.path,{
            resource_type:"raw"
        })
        const fileUrl = cloudinaryResult.secure_url;

        const extractedText = await extractTextFromPdf(fileUrl)
        res.status(200).json({
        message: "Text extracted successfully",
        text: extractedText,
        })
     } catch (error) {
        console.error("Upload error:", error);
        next(errorHandler(500, "filed to upload pdf"))
     }
}