"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.r2 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const env_1 = require("./env");
exports.r2 = new client_s3_1.S3Client({
    region: "auto",
    endpoint: `https://${env_1.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: env_1.R2_ACCESS_KEY_ID,
        secretAccessKey: env_1.R2_SECRET_ACCESS_KEY
    }
});
