"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalFolderCount = exports.deleteFolder = exports.removeDocumentFromFolder = exports.addDocumentToFolder = exports.getAllUserFolders = exports.createFolder = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const folders_model_1 = require("../models/folders.model");
const createFolder = async (req, res, next) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return next((0, errorHandler_1.errorHandler)(400, "A valid folder name is required"));
    }
    const userId = req.user?.id;
    if (!userId) {
        return next((0, errorHandler_1.errorHandler)(401, "Unauthorized"));
    }
    const existingFolder = await folders_model_1.Folder.findOne({ name, userId });
    if (existingFolder) {
        return next((0, errorHandler_1.errorHandler)(400, "Choose a new folder name, folder with this name already exists"));
    }
    try {
        const newFolder = await folders_model_1.Folder.create({
            name,
            userId,
            documents: []
        });
        res.status(201).json({
            success: true,
            message: "Folder created successfully",
            folder: newFolder
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "Failed to create folder"));
    }
};
exports.createFolder = createFolder;
const getAllUserFolders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const userId = req.user?.id;
        if (!userId) {
            return next((0, errorHandler_1.errorHandler)(401, "Unauthorized"));
        }
        const folders = await folders_model_1.Folder.find({ userId }).populate("documents").limit(limit).skip(skip).sort({ createdAt: -1 }).lean();
        res.status(200).json({
            success: true,
            folders
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "Failed to fetch folders"));
    }
};
exports.getAllUserFolders = getAllUserFolders;
const addDocumentToFolder = async (req, res, next) => {
    try {
        const { documentIds } = req.body;
        if (!Array.isArray(documentIds) || documentIds.length === 0) {
            return next((0, errorHandler_1.errorHandler)(400, 'document Ids is required'));
        }
        const { folderId } = req.params;
        if (!folderId || folderId === '') {
            return next((0, errorHandler_1.errorHandler)(400, 'folder Id is required'));
        }
        const userId = req.user?.id;
        if (!userId) {
            return next((0, errorHandler_1.errorHandler)(401, "Unauthorized"));
        }
        const existingFolder = await folders_model_1.Folder.findOne({ _id: folderId, userId });
        if (!existingFolder) {
            return next((0, errorHandler_1.errorHandler)(404, "Folder not found"));
        }
        const updatedFolder = await folders_model_1.Folder.findByIdAndUpdate(folderId, { $addToSet: { documents: { $each: documentIds } } }, { new: true });
        res.status(200).json({
            success: true,
            message: "Document added to folder successfully",
            folder: updatedFolder
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "Failed to add document to folder"));
    }
};
exports.addDocumentToFolder = addDocumentToFolder;
const removeDocumentFromFolder = async (req, res, next) => {
    try {
        // const { documentId } = req.body;
        const { folderId, documentId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return next((0, errorHandler_1.errorHandler)(401, "Unauthorized"));
        }
        if (!folderId || folderId === '') {
            return next((0, errorHandler_1.errorHandler)(400, 'folder Id is required'));
        }
        if (!documentId || documentId === '') {
            return next((0, errorHandler_1.errorHandler)(400, 'document Id is required'));
        }
        const existingFolder = await folders_model_1.Folder.findOne({ _id: folderId, userId });
        if (!existingFolder) {
            return next((0, errorHandler_1.errorHandler)(404, "Folder not found"));
        }
        existingFolder.documents = existingFolder.documents.filter(id => !(id.equals(documentId)));
        await existingFolder.save();
        res.status(200).json({
            success: true,
            message: "Document removed from folder successfully",
            folder: existingFolder
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, "Failed to remove document from folder"));
    }
};
exports.removeDocumentFromFolder = removeDocumentFromFolder;
const deleteFolder = async (req, res, next) => {
    try {
        const { folderId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return next((0, errorHandler_1.errorHandler)(401, "Unauthorized"));
        }
        const existingFolder = await folders_model_1.Folder.findOne({ _id: folderId, userId });
        if (!existingFolder) {
            return next((0, errorHandler_1.errorHandler)(404, "Folder not found"));
        }
        const folderDeletion = await folders_model_1.Folder.findByIdAndDelete(folderId);
        if (!folderDeletion) {
            return next((0, errorHandler_1.errorHandler)(500, "Failed to delete folder"));
        }
        res.status(200).json({
            success: true,
            message: "Folder deleted successfully",
        });
    }
    catch (error) {
        console.log(error);
        next((0, errorHandler_1.errorHandler)(500, 'failed to delete folder '));
    }
};
exports.deleteFolder = deleteFolder;
const totalFolderCount = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return next((0, errorHandler_1.errorHandler)(401, 'Unauthorized'));
        }
        const folderCount = await folders_model_1.Folder.countDocuments({ userId });
        res.status(200).json({
            success: true,
            folderCount
        });
    }
    catch (error) {
        next((0, errorHandler_1.errorHandler)(500, "failed to get total folder count"));
    }
};
exports.totalFolderCount = totalFolderCount;
