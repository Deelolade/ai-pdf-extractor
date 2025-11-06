"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.getDocument = exports.getAllMyDocuments = exports.summarizePdf = exports.uploadPdf = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const pdfExtractor_1 = require("../utils/pdfExtractor");
const r2Upload_1 = require("../utils/r2Upload");
const summarizeFullPdf_1 = require("../utils/summarizeFullPdf");
const user_model_1 = require("../models/user.model");
const upload_model_1 = require("../models/upload.model");
const env_1 = require("../utils/env");
const r2Delete_1 = require("../utils/r2Delete");
const uploadPdf = async (req, res, next) => {
    try {
        if (!req.file) {
            return next((0, errorHandler_1.errorHandler)(400, "No file uploaded"));
        }
        const user = await user_model_1.User.findById(req.user?.id);
        if (!user) {
            return next((0, errorHandler_1.errorHandler)(404, "User not found"));
        }
        const { buffer, originalname, mimetype } = req.file;
        const fileUrl = await (0, r2Upload_1.uploadToR2)(buffer, originalname, mimetype);
        const extractedText = await (0, pdfExtractor_1.extractTextFromPdf)(fileUrl);
        const uploadText = await new upload_model_1.Upload({
            userId: req.user?.id,
            textExtracted: extractedText,
            fileName: originalname,
            fileUrl,
            wordCount: extractedText.split(' ').length,
        });
        await uploadText.save();
        if (!user.isPaidUser) {
            if (user.trialCount >= env_1.MAX_TRIALS) {
                return next((0, errorHandler_1.errorHandler)(403, "Trial limit reached. Please upgrade to a paid account."));
            }
            user.trialCount += 1;
            await user.save();
        }
        res.status(200).json({
            message: "File uploaded and text extracted successfully",
            fileUrl,
            text: extractedText,
            uploadId: uploadText._id,
        });
    }
    catch (error) {
        console.error("Upload error:", error);
        next((0, errorHandler_1.errorHandler)(500, "filed to upload pdf"));
    }
};
exports.uploadPdf = uploadPdf;
const summarizePdf = async (req, res, next) => {
    try {
        const { uploadId } = req.params;
        if (!uploadId) {
            return next((0, errorHandler_1.errorHandler)(400, "Upload Id is required for summarization"));
        }
        const uploadRecord = await upload_model_1.Upload.findById(uploadId);
        if (!uploadRecord) {
            return next((0, errorHandler_1.errorHandler)(404, "Upload record not found"));
        }
        const user = await user_model_1.User.findById(req.user?.id);
        if (!user) {
            return next((0, errorHandler_1.errorHandler)(404, "User not found"));
        }
        const summary = await (0, summarizeFullPdf_1.summarizeFullPdf)(uploadRecord.textExtracted);
        if (!summary) {
            return next((0, errorHandler_1.errorHandler)(500, "Failed to generate summary"));
        }
        uploadRecord.summary = summary || "";
        await uploadRecord.save();
        if (!user.isPaidUser) {
            if (user.trialCount >= env_1.MAX_TRIALS) {
                return next((0, errorHandler_1.errorHandler)(403, "Trial limit reached. Please upgrade to a paid account."));
            }
            user.trialCount += 1;
            await user.save();
        }
        res.status(200).json({
            message: "PDF summarized successfully",
            summary,
        });
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "failed to summarize pdf"));
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
        next((0, errorHandler_1.errorHandler)(500, "failed to get uploads"));
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
        next((0, errorHandler_1.errorHandler)(500, "failed to get uploads"));
    }
};
exports.getDocument = getDocument;
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
            return next((0, errorHandler_1.errorHandler)(404, "Upload not found or unauthorized "));
        }
        const filename = findUpload.fileName;
        await (0, r2Delete_1.deleteFromR2)(filename);
        await upload_model_1.Upload.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Upload have been deleted successfully !!"
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "Failed to delete upload"));
    }
};
exports.deleteDocument = deleteDocument;
