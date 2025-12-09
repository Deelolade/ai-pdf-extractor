"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Folder = void 0;
const mongoose_1 = require("mongoose");
const folderSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    documents: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'upload',
        }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
exports.Folder = (0, mongoose_1.model)('folder', folderSchema);
