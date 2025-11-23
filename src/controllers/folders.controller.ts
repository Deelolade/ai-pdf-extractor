import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import { Folder } from "../models/folders.model";

export const createFolder = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return next(errorHandler(400, "A valid folder name is required"));
    }
    const userId = req.user?.id;
    if (!userId) {
        return next(errorHandler(401, "Unauthorized"))
    }
    const existingFolder = await Folder.findOne({name, userId})
    if (existingFolder) {
        return next(errorHandler(400, "Choose a new folder name, folder with this name already exists"))
    }
    try {
        const newFolder = await Folder.create({
            name,
            userId,
            documentIds: []
        })
        res.status(201).json({
            success: true,
            message: "Folder created successfully",
            folder: newFolder
        })
    } catch (error) {
        console.log(error)
        next(errorHandler(500, "Failed to create folder"))
    }
};
export const getAllUserFolders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const skip = (page - 1) * limit;
        const userId = req.user?.id;
        if(!userId){
            return next(errorHandler(401, "Unauthorized"))
        }
        const folders = await Folder.find({userId}).limit(limit).skip(skip).sort({createdAt: -1});
        res.status(200).json({
            success: true,
            folders
        })
    } catch (error) {
        console.log(error)
        next(errorHandler(500, "Failed to fetch folders"))
    }
}
export const addDocumentToFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { documentId } = req.body;
         if(!documentId || documentId===''){
            return next (errorHandler(400, 'document Id is required'))
        }
        const { folderId } = req.params;
        if(!folderId || folderId===''){
            return next (errorHandler(400, 'folder Id is required'))
        }
        const userId = req.user?.id;
        if (!userId) {
            return next(errorHandler(401, "Unauthorized"))
        }
        const existingFolder = await Folder.findOne({ _id:folderId, userId });
        if (!existingFolder) {
            return next(errorHandler(404, "Folder not found"))
        }
        if(  existingFolder.documentIds.some(id => id === documentId) ||  existingFolder.documentIds.some(id => id.equals(documentId))){
            return next(errorHandler(400, "Document already exists in the folder"))
        }
        existingFolder.documentIds.push(documentId);
        await existingFolder.save()
        res.status(200).json({
            success: true,
            message: "Document added to folder successfully",
            folder: existingFolder
        })
    } catch (error) {
        console.log(error)
        next(errorHandler(500, "Failed to add document to folder"))
    }
}
export const removeDocumentFromFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const { documentId } = req.body;
        const { folderId, documentId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return next(errorHandler(401, "Unauthorized"))
        }
        if(!folderId || folderId===''){
            return next (errorHandler(400, 'folder Id is required'))
        }
        if(!documentId || documentId===''){
            return next (errorHandler(400, 'document Id is required'))
        }
        const existingFolder = await Folder.findOne({_id:folderId, userId });
        if (!existingFolder) {
            return next(errorHandler(404, "Folder not found"))
        }
        existingFolder.documentIds = existingFolder.documentIds.filter(id => !( id.equals(documentId)));
        await existingFolder.save()
        res.status(200).json({
            success: true,
            message: "Document removed from folder successfully",
            folder: existingFolder
        })
    } catch (error) {
        console.log(error)
        next(errorHandler(500, "Failed to remove document from folder"))
    }
}