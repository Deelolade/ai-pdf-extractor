"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = exports.Role = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["ASSISTANT"] = "assistant";
})(Role || (exports.Role = Role = {}));
const chatMessageSchema = new mongoose_1.default.Schema({
    role: {
        type: String,
        enum: [Role.USER, Role.ASSISTANT],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });
const chatSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    documentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'upload',
        required: true
    },
    messages: {
        type: [chatMessageSchema],
        default: []
    }
}, { timestamps: true });
exports.Chat = mongoose_1.default.model('chat', chatSchema);
