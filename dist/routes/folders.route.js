"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderRouter = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const folders_controller_1 = require("../controllers/folders.controller");
const rate_limiter_1 = require("../utils/rate-limiter");
exports.folderRouter = express_1.default.Router();
exports.folderRouter.post('/create', authMiddleware_1.authenticateUser, rate_limiter_1.createFolderLimiter, folders_controller_1.createFolder);
exports.folderRouter.post('/:folderId/add-documents', authMiddleware_1.authenticateUser, rate_limiter_1.addDocumentToFolderLimiter, folders_controller_1.addDocumentToFolder);
exports.folderRouter.delete('/delete/:folderId', authMiddleware_1.authenticateUser, folders_controller_1.deleteFolder);
exports.folderRouter.delete('/:folderId/documents/:documentId', authMiddleware_1.authenticateUser, rate_limiter_1.removeDocumentFromFolderLimiter, folders_controller_1.removeDocumentFromFolder);
exports.folderRouter.get('/me', authMiddleware_1.authenticateUser, folders_controller_1.getAllUserFolders);
