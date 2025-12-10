"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESEND_API_KEY = exports.NODE_ENV = exports.FLW_ENCRYPTION_KEY = exports.FLW_SECRET_KEY = exports.FLW_PUBLIC_KEY = exports.OPENAI_APIKEY = exports.PINECONE_INDEX = exports.PINECONE_API_KEY = exports.MAX_TRIALS = exports.R2_PUBLIC_URL = exports.R2_BUCKET_NAME = exports.R2_SECRET_ACCESS_KEY = exports.R2_ACCESS_KEY_ID = exports.CLOUDFLARE_ACCOUNT_ID = exports.FRONTEND_URL = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.apiKey = exports.EMAIL_PASS = exports.EMAIL_USER = exports.JWT_TOKEN = exports.MONGODB_URL = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.MONGODB_URL = process.env.MONGODB_URL;
if (!exports.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in .env");
}
exports.JWT_TOKEN = process.env.JWT_TOKEN;
if (!exports.JWT_TOKEN) {
    throw new Error("JWT_TOKEN is not defined in .env");
}
exports.EMAIL_USER = process.env.EMAIL_USER;
if (!exports.EMAIL_USER) {
    throw new Error("EMAIL_USER is not defined in .env");
}
exports.EMAIL_PASS = process.env.EMAIL_PASS;
if (!exports.EMAIL_PASS) {
    throw new Error("EMAIL_USER is not defined in .env");
}
exports.apiKey = process.env.API_KEY;
if (!exports.apiKey) {
    throw new Error("apiKey is not defined in .env");
}
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
if (!exports.CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME is not defined in .env");
}
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
if (!exports.CLOUDINARY_API_KEY) {
    throw new Error("CLOUDINARY_API_KEY is not defined in .env");
}
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
if (!exports.CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_SECRET is not defined in .env");
}
exports.FRONTEND_URL = process.env.FRONTEND_URL;
if (!exports.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not defined in .env");
}
exports.CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!exports.CLOUDFLARE_ACCOUNT_ID) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID is not defined in .env");
}
exports.R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
if (!exports.R2_ACCESS_KEY_ID) {
    throw new Error("R2_ACCESS_KEY_ID is not defined in .env");
}
exports.R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
if (!exports.R2_SECRET_ACCESS_KEY) {
    throw new Error("R2_SECRET_ACCESS_KEY is not defined in .env");
}
exports.R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
if (!exports.R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME is not defined in .env");
}
exports.R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;
if (!exports.R2_PUBLIC_URL) {
    throw new Error("R2_PUBLIC_URL is not defined in .env");
}
exports.MAX_TRIALS = Number(process.env.MAX_TRIALS);
if (isNaN(exports.MAX_TRIALS)) {
    throw new Error("MAX_TRIALS is not defined or is not a valid number in .env");
}
exports.PINECONE_API_KEY = process.env.PINECONE_API_KEY;
if (!exports.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not defined in .env");
}
exports.PINECONE_INDEX = process.env.PINECONE_INDEX;
if (!exports.PINECONE_INDEX) {
    throw new Error("PINECONE_INDEX is not defined in .env");
}
exports.OPENAI_APIKEY = process.env.OPENAI_APIKEY;
if (!exports.OPENAI_APIKEY) {
    throw new Error("OPENAI_APIKEY is not defined in .env");
}
exports.FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY;
if (!exports.FLW_PUBLIC_KEY) {
    throw new Error("FLW_PUBLIC_KEY is not defined in .env");
}
exports.FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
if (!exports.FLW_SECRET_KEY) {
    throw new Error("FLW_SECRET_KEY is not defined in .env");
}
exports.FLW_ENCRYPTION_KEY = process.env.FLW_ENCRYPTION_KEY;
if (!exports.FLW_ENCRYPTION_KEY) {
    throw new Error("FLW_ENCRYPTION_KEY is not defined in .env");
}
exports.NODE_ENV = process.env.NODE_ENV;
if (!exports.NODE_ENV) {
    throw new Error("NODE_ENV is not defined in .env");
}
exports.RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!exports.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined in .env");
}
