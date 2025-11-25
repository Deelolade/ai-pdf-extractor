import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { addDocumentToFolder, createFolder, getAllUserFolders, removeDocumentFromFolder, totalFolderCount } from '../controllers/folders.controller';
import { addDocumentToFolderLimiter, createFolderLimiter, getAllUserFoldersLimiter, removeDocumentFromFolderLimiter } from '../utils/rate-limiter';

export const folderRouter = express.Router();

folderRouter.post('/create', authenticateUser, createFolderLimiter, createFolder)
folderRouter.post('/:folderId/documents', authenticateUser, addDocumentToFolderLimiter, addDocumentToFolder)
folderRouter.delete('/:folderId/documents/:documentId', authenticateUser,removeDocumentFromFolderLimiter, removeDocumentFromFolder)
folderRouter.get('/', authenticateUser, getAllUserFoldersLimiter, getAllUserFolders)