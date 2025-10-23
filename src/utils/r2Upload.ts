import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { r2 } from "./r2Client";
import { R2_BUCKET_NAME } from "./env";

export const uploadToR2 = async ( filepath:string, filename:string)=>{
    const fileStream = fs.createReadStream(filepath);

    const uploadParams = {
        Bucket: R2_BUCKET_NAME,
        Key:filename,
        Body: fileStream,
        ContentType: "application/pdf"
    }
    await r2.send(new PutObjectCommand(uploadParams));

    return `https://${R2_BUCKET_NAME}.r2.dev/${filename}`;
}