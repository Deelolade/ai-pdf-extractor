import { NextFunction, Request, Response } from "express";
import { RequestWithFile } from "../types/express";
import { errorHandler } from "../utils/errorHandler";
import { extractTextFromPdf } from "../utils/pdfExtractor";
import { uploadToR2 } from "../utils/r2Upload";
import { summarizeFullPdf } from "../utils/summarizeFullPdf";
import { User } from "../models/user.model";
import { Upload } from "../models/upload.model";
import { MAX_TRIALS } from "../utils/env";
import { deleteFromR2 } from "../utils/r2Delete";

export const uploadPdf = async (req: RequestWithFile, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "No file uploaded"));
    }
    const { buffer, originalname, mimetype } = req.file;
    const fileUrl = await uploadToR2(buffer, originalname, mimetype);

    console.log("Extracting text...");
    const extractedText = await extractTextFromPdf(fileUrl);

    const uploadText = await new Upload({
      userId: req.user?.id,
      textExtracted: extractedText,
      fileName: originalname,
      fileUrl,
      wordCount: extractedText.split(' ').length,
    });
    await uploadText.save()
    res.status(200).json({
      message: "File uploaded and text extracted successfully",
      fileUrl,
      text: extractedText,
      uploadId: uploadText._id,

    });
  } catch (error) {
    console.error("Upload error:", error);
    next(errorHandler(500, "filed to upload pdf"))
  }
}

export const summarizePdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uploadId } = req.body;
    if (!uploadId) {
      return next(errorHandler(400, "Upload Id is required for summarization"));
    }

    const uploadRecord = await Upload.findById(uploadId);
    if (!uploadRecord) {
      return next(errorHandler(404, "Upload record not found"));
    }
    const summary = await summarizeFullPdf(uploadRecord.textExtracted);

    uploadRecord.summary = summary || "";
    await uploadRecord.save();


    const user = await User.findById(req.user?.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    if (!user.isPaidUser) {
      if (user.trialCount >= MAX_TRIALS) {
        return next(errorHandler(403, "Trial limit reached. Please upgrade to a paid account."));
      }
      user.trialCount += 1;
      await user.save();
    }
    res.status(200).json({
      message: "PDF summarized successfully",
      summary,
    });
  } catch (error) {
    next(errorHandler(500, "failed to summarize pdf"))
  }
}
export const getAllMyUploads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allUploads = await Upload.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      message: "Uploads fetched successfully",
      uploads: allUploads
    })
  } catch (error) {
    next(errorHandler(500, "failed to get uploads"))
  }
}
export const deleteUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    console.log(req.params)
    if (!id) {
      return next(errorHandler(400, "Upload id is required"))
    }
    const findUpload = await Upload.findOne({ _id: id, userId })

    if (!findUpload) {
      return next(errorHandler(404, "Upload not found or unauthorized "))
    }
    const filename = findUpload.fileName
    await deleteFromR2(filename)

    await Upload.findByIdAndDelete(id)
    res.status(200).json({
      success: true,
      message: "Upload have been deleted successfully !!"
    })
  } catch (error) {
    console.log(error)
    next(errorHandler(500, "Failed to delete upload"))
  }
}