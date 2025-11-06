"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIrouter = void 0;
const express_1 = __importDefault(require("express"));
const ask_ai_1 = require("../utils/ask-ai");
exports.AIrouter = express_1.default.Router();
exports.AIrouter.post("/", async (req, res) => {
    const { context, question } = req.body;
    //   if (!context || !question) {
    //     return res.status(400).json({ message: "Context and question are required" });
    //   }
    try {
        const answer = await (0, ask_ai_1.askAI)(context, question);
        res.json({ success: true, answer });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});
