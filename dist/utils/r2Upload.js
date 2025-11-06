"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToR2 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const r2Client_1 = require("./r2Client");
const env_1 = require("./env");
const uploadToR2 = async (fileBuffer, filename, mimetype) => {
    const uploadParams = {
        Bucket: env_1.R2_BUCKET_NAME,
        Key: filename,
        Body: fileBuffer,
        ContentType: mimetype
    };
    await r2Client_1.r2.send(new client_s3_1.PutObjectCommand(uploadParams));
    return `${env_1.R2_PUBLIC_URL}/${filename}`;
};
exports.uploadToR2 = uploadToR2;
