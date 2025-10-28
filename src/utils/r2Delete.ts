import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "./r2Client";
import { R2_BUCKET_NAME } from "./env";

export const deleteFromR2 = async ( fileName:string)=>{
    try {
        const deleteParams ={
            Bucket: R2_BUCKET_NAME,
            Key: fileName
        }
        await r2.send( new DeleteObjectCommand(deleteParams))
        console.log(`File deleted from R2: ${fileName}`)
    } catch (error) {
        console.log("Failed to delete file from r2",error)
        throw new Error("Failed to delete file from R2")
    }
}