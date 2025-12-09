"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalDocumentCount = exports.deleteDocument = exports.updateDocument = exports.getDocument = exports.getAllMyDocuments = exports.summarizePdf = exports.uploadPdf = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const pdfExtractor_1 = require("../utils/pdfExtractor");
const r2Upload_1 = require("../utils/r2Upload");
const summarizeFullPdf_1 = require("../utils/summarizeFullPdf");
const user_model_1 = require("../models/user.model");
const upload_model_1 = require("../models/upload.model");
const env_1 = require("../utils/env");
const r2Delete_1 = require("../utils/r2Delete");
const genai_1 = require("@google/genai");
const geminiEmbed = new genai_1.GoogleGenAI({});
const uploadPdf = async (req, res, next) => {
    try {
        if (!req.file) {
            return next((0, errorHandler_1.errorHandler)(400, "No file uploaded"));
        }
        const user = await user_model_1.User.findById(req.user?.id);
        if (!user) {
            return next((0, errorHandler_1.errorHandler)(404, "User not found"));
        }
        // IF USER IS A PAID USER
        if (!user.isPaidUser) {
            if (user.trialCount >= env_1.MAX_TRIALS) {
                return next((0, errorHandler_1.errorHandler)(403, "Trial limit reached. Please upgrade to a paid account."));
            }
        }
        // EXTRACT AND UPLOAD DOCUMENTS TO CLOUDFLARE
        const { buffer, originalname, mimetype } = req.file;
        const fileUrl = await (0, r2Upload_1.uploadToR2)(buffer, originalname, mimetype);
        // EXTRACT FROM UPLOADED DOCUMENTS 
        const extractedText = await (0, pdfExtractor_1.extractTextFromPdf)(fileUrl);
        const uploadText = await new upload_model_1.Upload({
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
    }
    catch (error) {
        console.error("Upload error:", error);
        next((0, errorHandler_1.errorHandler)(500, "filed to upload document"));
    }
};
exports.uploadPdf = uploadPdf;
const summarizePdf = async (req, res, next) => {
    try {
        const { uploadId } = req.params;
        if (!uploadId) {
            return next((0, errorHandler_1.errorHandler)(400, "Document Id is required for summarization"));
        }
        const uploadRecord = await upload_model_1.Upload.findById(uploadId);
        if (!uploadRecord) {
            return next((0, errorHandler_1.errorHandler)(404, "Document record not found"));
        }
        const user = await user_model_1.User.findById(req.user?.id);
        if (!user) {
            return next((0, errorHandler_1.errorHandler)(404, "User not found"));
        }
        // IF USER IS A PAID USER
        if (!user.isPaidUser) {
            if (user.trialCount >= env_1.MAX_TRIALS) {
                return next((0, errorHandler_1.errorHandler)(403, "Trial limit reached. Please upgrade to a paid account."));
            }
        }
        const summary = await (0, summarizeFullPdf_1.summarizeFullPdf)(uploadRecord.textExtracted);
        if (!summary) {
            return next((0, errorHandler_1.errorHandler)(500, "Failed to generate summary"));
        }
        uploadRecord.summary = summary || "";
        await uploadRecord.save();
        // INCREASE USER TRIAL COUNT FOR FREE USERS 
        if (!user.isPaidUser) {
            user.trialCount += 1;
            await user.save();
        }
        res.status(200).json({
            message: "Document summarized successfully",
            summary,
        });
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "failed to summarize Document"));
    }
};
exports.summarizePdf = summarizePdf;
const getAllMyDocuments = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const allDocuments = await upload_model_1.Upload.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalDocuments = await upload_model_1.Upload.countDocuments({ userId });
        const totalPages = Math.ceil(totalDocuments / limit);
        res.status(201).json({
            success: true,
            message: "All documents fetched successfully",
            documents: allDocuments,
            totalDocuments: totalDocuments,
            totalPages: totalPages,
            currentPage: page,
        });
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "failed to get documents"));
    }
};
exports.getAllMyDocuments = getAllMyDocuments;
const getDocument = async (req, res, next) => {
    try {
        const { uploadId } = req.params;
        if (!uploadId) {
            return next((0, errorHandler_1.errorHandler)(400, "Document not found"));
        }
        const user = req.user?.id;
        if (!user) {
            return next((0, errorHandler_1.errorHandler)(400, "User not found"));
        }
        const document = await upload_model_1.Upload.findById(uploadId);
        res.status(200).json({
            success: true,
            document
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "failed to get document"));
    }
};
exports.getDocument = getDocument;
const updateDocument = async (req, res, next) => {
    try {
        const { fileName } = req.body;
        const { id } = req.params;
        const userId = req.user?.id;
        // console.log(req.params)
        if (!id) {
            return next((0, errorHandler_1.errorHandler)(400, "Upload id is required"));
        }
        if (!fileName || typeof fileName !== 'string') {
            return next((0, errorHandler_1.errorHandler)(400, "A valid fileName is required"));
        }
        const findUpload = await upload_model_1.Upload.findOne({ _id: id, userId });
        if (!findUpload) {
            return next((0, errorHandler_1.errorHandler)(404, "Document not found or unauthorized "));
        }
        const updatedDocument = await upload_model_1.Upload.findByIdAndUpdate(id, { fileName }, { new: true });
        res.status(200).json({
            success: true,
            message: " Document file name updated successfully!!",
            document: updatedDocument,
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "Failed to delete document"));
    }
};
exports.updateDocument = updateDocument;
const deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        // console.log(req.params)
        if (!id) {
            return next((0, errorHandler_1.errorHandler)(400, "Upload id is required"));
        }
        const findUpload = await upload_model_1.Upload.findOne({ _id: id, userId });
        if (!findUpload) {
            return next((0, errorHandler_1.errorHandler)(404, "Document not found or unauthorized "));
        }
        const filename = findUpload.fileName;
        await (0, r2Delete_1.deleteFromR2)(filename);
        await upload_model_1.Upload.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Document have been deleted successfully !!"
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "Failed to delete document"));
    }
};
exports.deleteDocument = deleteDocument;
const totalDocumentCount = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return next((0, errorHandler_1.errorHandler)(401, 'Unauthorized'));
        }
        const documentCount = await upload_model_1.Upload.countDocuments({ userId });
        res.status(200).json({
            success: true,
            documentCount
        });
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "failed to get total document count"));
    }
};
exports.totalDocumentCount = totalDocumentCount;
