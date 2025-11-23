import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { addDocumentToFolder, createFolder, getAllUserFolders, removeDocumentFromFolder } from '../controllers/folders.controller';

export const folderRouter = express.Router();

folderRouter.post('/create', authenticateUser, createFolder)
folderRouter.post('/:folderId/documents', authenticateUser, addDocumentToFolder)
folderRouter.delete('/:folderId/documents/:documentId', authenticateUser, removeDocumentFromFolder)
folderRouter.get('/', authenticateUser, getAllUserFolders)