import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { createFolder } from '../controllers/folders.controller';

export const folderRouter = express.Router();

folderRouter.post('/create', authenticateUser, createFolder)