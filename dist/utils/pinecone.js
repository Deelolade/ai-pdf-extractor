"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pc = void 0;
const pinecone_1 = require("@pinecone-database/pinecone");
const env_1 = require("./env");
exports.pc = new pinecone_1.Pinecone({
    apiKey: env_1.PINECONE_API_KEY
});
