
import express from "express";
import {  totalDocumentCount } from "../controllers/document.controller";
import { authenticateUser } from "../middleware/authMiddleware";
import { totalFolderCount } from "../controllers/folders.controller";


export const dashboardRouter = express.Router();

dashboardRouter.get('/documents/count',authenticateUser, totalDocumentCount)
dashboardRouter.get('/folders/count', authenticateUser, totalFolderCount)
