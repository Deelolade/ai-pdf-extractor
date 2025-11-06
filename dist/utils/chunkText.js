"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkText = void 0;
const chunkText = (text, chunkSize = 2000) => {
    const sentences = text.split(/(?<=[.?!])\s+/);
    const chunks = [];
    let currentChunk = "";
    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > chunkSize) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        }
        else {
            currentChunk += " " + sentence;
        }
    }
    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
};
exports.chunkText = chunkText;
