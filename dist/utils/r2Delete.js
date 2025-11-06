"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromR2 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const r2Client_1 = require("./r2Client");
const env_1 = require("./env");
const deleteFromR2 = async (fileName) => {
    try {
        const deleteParams = {
            Bucket: env_1.R2_BUCKET_NAME,
            Key: fileName
        };
        await r2Client_1.r2.send(new client_s3_1.DeleteObjectCommand(deleteParams));
        console.log(`File deleted from R2: ${fileName}`);
    }
    catch (error) {
        console.log("Failed to delete file from r2", error);
        throw new Error("Failed to delete file from R2");
    }
};
exports.deleteFromR2 = deleteFromR2;
