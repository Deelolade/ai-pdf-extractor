"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express_1 = __importDefault(require("express"));
const document_controller_1 = require("../controllers/document.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const folders_controller_1 = require("../controllers/folders.controller");
exports.dashboardRouter = express_1.default.Router();
exports.dashboardRouter.get('/documents/count', authMiddleware_1.authenticateUser, document_controller_1.totalDocumentCount);
exports.dashboardRouter.get('/folders/count', authMiddleware_1.authenticateUser, folders_controller_1.totalFolderCount);
