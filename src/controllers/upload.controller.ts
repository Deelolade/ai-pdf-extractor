import { NextFunction, Request, Response } from "express";
import { RequestWithFile } from "../types/express";
import { errorHandler } from "../utils/errorHandler";
import { extractTextFromPdf } from "../utils/pdfExtractor";
import { uploadToR2 } from "../utils/r2Upload";
import { summarizeFullPdf } from "../utils/summarizeFullPdf";
import { User } from "../models/user.model";
import { Jwt } from "jsonwebtoken";
import { Upload } from "../models/upload.model";

export const uploadPdf = async (req: RequestWithFile, res: Response, next: NextFunction) => {

  try {
    if (!req.file) {
      return next(errorHandler(400, "No file uploaded"));
    }

    console.log("Uploading to R2...");

    const { buffer, originalname, mimetype } = req.file;
    console.log(buffer, originalname, mimetype)
    const fileUrl = await uploadToR2(buffer, originalname, mimetype);

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

export const summarizePdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;
    if(!text){
      return next(errorHandler(400, "Text is required for summarization"));
    }
    const summary = await summarizeFullPdf(text);
    console.log("final summary", summary)
    const userId = req.user?.id;
    const user = await User.findById(userId);
     if (!user) {
    return next(errorHandler(404, "User not found"));
  }
      if(!user.isPaidUser){
        user.trialCount +=1;
        await user.save();
      }
      const uploadText = await new Upload({
        userId: userId,
        summary: summary,
        textExtracted: text,
        fileName: "N/A",
        fileUrl: "N/A",
        wordCount:text.split(' ').length,
      });
      await uploadText.save()
    res.status(200).json({
      message: "PDF summarized successfully",
      summary,
    });
  } catch (error) {
    next(errorHandler(500, "failed to summarize pdf"))
  }
}