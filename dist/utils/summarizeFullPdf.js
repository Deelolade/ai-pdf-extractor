"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeFullPdf = void 0;
const chunkText_1 = require("./chunkText");
const summarizePdf_1 = require("./summarizePdf");
const summarizeFullPdf = async (text) => {
    const chunks = (0, chunkText_1.chunkText)(text);
    console.log("chunk created:", chunks.length);
    const summaries = [];
    for (const chunk of chunks) {
        const summary = await (0, summarizePdf_1.summarizeChunk)(chunk);
        summaries.push(summary);
    }
    const finalSummary = await (0, summarizePdf_1.summarizeChunk)(summaries.join("\n"));
    return finalSummary;
};
exports.summarizeFullPdf = summarizeFullPdf;
