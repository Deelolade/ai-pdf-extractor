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