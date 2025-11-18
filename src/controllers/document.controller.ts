import { NextFunction, Request, Response } from "express";
import { RequestWithFile } from "../types/express";
import { errorHandler } from "../utils/errorHandler";
import { extractTextFromPdf } from "../utils/pdfExtractor";
import { uploadToR2 } from "../utils/r2Upload";
import { summarizeFullPdf } from "../utils/summarizeFullPdf";
import { User } from "../models/user.model";
import { Upload } from "../models/upload.model";
import { MAX_TRIALS, PINECONE_INDEX } from "../utils/env";
import { deleteFromR2 } from "../utils/r2Delete";
import { chunkText } from "../utils/chunkText";
import { GoogleGenAI } from "@google/genai";
import { pc } from "../utils/pinecone";

const geminiEmbed = new GoogleGenAI({})

export const uploadPdf = async (req: RequestWithFile, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, "No file uploaded"));
    }
    const user = await User.findById(req.user?.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    // IF USER IS A PAID USER
    if (!user.isPaidUser) {
      if (user.trialCount >= MAX_TRIALS) {
        return next(errorHandler(403, "Trial limit reached. Please upgrade to a paid account."));
      }
    }

    // EXTRACT AND UPLOAD DOCUMENTS TO CLOUDFLARE
    const { buffer, originalname, mimetype } = req.file;
    const fileUrl = await uploadToR2(buffer, originalname, mimetype);

    // EXTRACT FROM UPLOADED DOCUMENTS 
    const extractedText = await extractTextFromPdf(fileUrl);

    const uploadText = await new Upload({
      userId: req.user?.id,
      textExtracted: extractedText,
      fileName: originalname,
      fileUrl,
      wordCount: extractedText.trim().split(/\s+/).length,
    });
    await uploadText.save();

    // INCREASE USER TRIAL COUNT FOR FREE USERS 
    // if (!user.isPaidUser) {
    //   user.trialCount += 1;
    //   await user.save()
    // }
    res.status(200).json({
      message: "File uploaded and text extracted successfully",
      fileUrl,
      text: extractedText,
      uploadId: uploadText._id,

    });
  } catch (error) {
    console.error("Upload error:", error);
    next(errorHandler(500, "filed to upload document"))
  }
}

export const summarizePdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uploadId } = req.params;
    if (!uploadId) {
      return next(errorHandler(400, "Document Id is required for summarization"));
    }

    const uploadRecord = await Upload.findById(uploadId);
    if (!uploadRecord) {
      return next(errorHandler(404, "Document record not found"));
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    // IF USER IS A PAID USER
    if (!user.isPaidUser) {
      if (user.trialCount >= MAX_TRIALS) {
        return next(errorHandler(403, "Trial limit reached. Please upgrade to a paid account."));
      }
    }
    const summary = await summarizeFullPdf(uploadRecord.textExtracted);
    if (!summary) {
      return next(errorHandler(500, "Failed to generate summary"));
    }

    uploadRecord.summary = summary || "";
    await uploadRecord.save();

    // INCREASE USER TRIAL COUNT FOR FREE USERS 
    if (!user.isPaidUser) {
      user.trialCount += 1;
      await user.save()
    }
    res.status(200).json({
      message: "Document summarized successfully",
      summary,
    });
  } catch (error) {
    next(errorHandler(500, "failed to summarize Document"))
  }
}
export const getAllMyDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const allDocuments = await Upload.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalDocuments = await Upload.countDocuments({ userId });

    const totalPages = Math.ceil(totalDocuments / limit)
    res.status(201).json({
      success: true,
      message: "All documents fetched successfully",
      documents: allDocuments,
      totalDocuments: totalDocuments,
      totalPages: totalPages,
      currentPage: page,
    })
  } catch (error) {
    next(errorHandler(500, "failed to get documents"))
  }
}
export const getDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uploadId } = req.params;
    if (!uploadId) {
      return next(errorHandler(400, "Document not found"))
    }
    const user = req.user?.id;
    if (!user) {
      return next(errorHandler(400, "User not found"))
    }
    const document = await Upload.findById(uploadId)
    res.status(200).json({
      success: true,
      document
    })
  } catch (error) {
    console.log(error)
    next(errorHandler(500, "failed to get document"))
  }
}
export const updateDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fileName } = req.body
    const { id } = req.params;
    const userId = req.user?.id;
    // console.log(req.params)
    if (!id) {
      return next(errorHandler(400, "Upload id is required"))
    }

    if (!fileName || typeof fileName !== 'string') {
      return next(errorHandler(400, "A valid fileName is required"));
    }


    const findUpload = await Upload.findOne({ _id: id, userId })

    if (!findUpload) {
      return next(errorHandler(404, "Document not found or unauthorized "))
    }

    const updatedDocument = await Upload.findByIdAndUpdate(
      id,
      { fileName },
      { new: true }
    )
    res.status(200).json({
      success: true,
      message: " Document file name updated successfully!!",
      document: updatedDocument,
    })
  } catch (error) {
    console.log(error)
    next(errorHandler(500, "Failed to delete document"))
  }
}
export const deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    // console.log(req.params)
    if (!id) {
      return next(errorHandler(400, "Upload id is required"))
    }
    const findUpload = await Upload.findOne({ _id: id, userId })

    if (!findUpload) {
      return next(errorHandler(404, "Document not found or unauthorized "))
    }
    const filename = findUpload.fileName
    await deleteFromR2(filename)

    await Upload.findByIdAndDelete(id)
    res.status(200).json({
      success: true,
      message: "Document have been deleted successfully !!"
    })
  } catch (error) {
    console.log(error)
    next(errorHandler(500, "Failed to delete document"))
  }
}