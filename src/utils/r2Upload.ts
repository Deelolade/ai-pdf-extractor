import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2Client";
import { R2_BUCKET_NAME, R2_PUBLIC_URL } from "./env";

export const uploadToR2 = async ( fileBuffer: Buffer, filename:string,  mimetype:string)=>{
    const uploadParams = {
        Bucket: R2_BUCKET_NAME,
        Key:filename,
        Body: fileBuffer,
        ContentType: mimetype
    }
    await r2.send(new PutObjectCommand(uploadParams));

    return `${R2_PUBLIC_URL}/${filename}`;
}