"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uploadSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    summary: {
        type: String,
    },
    wordCount: {
        type: Number,
    },
    textExtracted: {
        type: String,
        require: true
    },
    processedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
exports.Upload = mongoose_1.default.model('upload', uploadSchema);
