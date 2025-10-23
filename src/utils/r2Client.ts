import { S3Client } from "@aws-sdk/client-s3";
import { CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } from "./env";

export const r2 = new S3Client({
    region:"auto",
    endpoint:`https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials:{
        accessKeyId:R2_ACCESS_KEY_ID,
        secretAccessKey:R2_SECRET_ACCESS_KEY
    }
})