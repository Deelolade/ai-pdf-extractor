"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromPdf = void 0;
const { PDFParse } = require("pdf-parse");
const extractTextFromPdf = async (fileUrl, maxPages = 5) => {
    try {
        const parser = new PDFParse({ url: fileUrl });
        const pdfData = await parser.getText();
        const textArray = pdfData.text.split(/\f+/);
        const limitedText = textArray.slice(0, maxPages).join("\n");
        return limitedText.trim();
    }
    catch (error) {
        console.log("Error reading pdf:", error);
        throw new Error("Failed to extract text from pdf" + error.message);
    }
};
exports.extractTextFromPdf = extractTextFromPdf;
