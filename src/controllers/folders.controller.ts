import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/errorHandler";
import { Folder } from "../models/folders.model";

export const createFolder = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
        return next(errorHandler(400, "A valid folder name is required"));
    }
    const userId = req.user?.id;
    if (!userId) {
        return next(errorHandler(401, "Unauthorized"))
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