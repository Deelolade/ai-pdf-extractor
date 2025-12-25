import { config } from "dotenv"
config();

export const MONGODB_URL = process.env.MONGODB_URL as string;
if(!MONGODB_URL){
    throw new Error ("MONGODB_URL is not defined in .env")
}
export const JWT_TOKEN = process.env.JWT_TOKEN as string;
if(!JWT_TOKEN){
    throw new Error ("JWT_TOKEN is not defined in .env")
}
export const EMAIL_USER = process.env.EMAIL_USER as string;
if(!EMAIL_USER){
    throw new Error ("EMAIL_USER is not defined in .env")
}
export const EMAIL_PASS = process.env.EMAIL_PASS as string;
if(!EMAIL_PASS){
    throw new Error ("EMAIL_USER is not defined in .env")
}

export const apiKey = process.env.API_KEY as string;
if(!apiKey){
    throw new Error ("apiKey is not defined in .env")
}
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME as string;
if(!CLOUDINARY_CLOUD_NAME){
    throw new Error ("CLOUDINARY_CLOUD_NAME is not defined in .env")
}

export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY as string;
if(!CLOUDINARY_API_KEY){
    throw new Error ("CLOUDINARY_API_KEY is not defined in .env")
}
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET as string;
if(!CLOUDINARY_API_SECRET){
    throw new Error ("CLOUDINARY_API_SECRET is not defined in .env")
}

export const FRONTEND_URL = process.env.FRONTEND_URL as string;
if(!FRONTEND_URL){
    throw new Error ("FRONTEND_URL is not defined in .env")
}
export const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID as string;
if(!CLOUDFLARE_ACCOUNT_ID){
    throw new Error ("CLOUDFLARE_ACCOUNT_ID is not defined in .env")
}
export const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID as string;
if(!R2_ACCESS_KEY_ID){
    throw new Error ("R2_ACCESS_KEY_ID is not defined in .env")
}
export const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY as string;
if(!R2_SECRET_ACCESS_KEY){
    throw new Error ("R2_SECRET_ACCESS_KEY is not defined in .env")
}
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME as string;
if(!R2_BUCKET_NAME){
    throw new Error ("R2_BUCKET_NAME is not defined in .env")
}
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL as string;
if(!R2_PUBLIC_URL){
    throw new Error ("R2_PUBLIC_URL is not defined in .env")
}
export const MAX_TRIALS = Number(process.env.MAX_TRIALS);
if(isNaN(MAX_TRIALS)){
    throw new Error ("MAX_TRIALS is not defined or is not a valid number in .env")
}

export const PINECONE_API_KEY = process.env.PINECONE_API_KEY as string;
if(!PINECONE_API_KEY){
    throw new Error ("PINECONE_API_KEY is not defined in .env")
}
export const PINECONE_INDEX = process.env.PINECONE_INDEX as string;
if(!PINECONE_INDEX){
    throw new Error ("PINECONE_INDEX is not defined in .env")
}
export const OPENAI_APIKEY = process.env.OPENAI_APIKEY as string;
if(!OPENAI_APIKEY){
    throw new Error ("OPENAI_APIKEY is not defined in .env")
}
export const FLW_PUBLIC_KEY = process.env.FLW_PUBLIC_KEY as string;
if(!FLW_PUBLIC_KEY){
    throw new Error ("FLW_PUBLIC_KEY is not defined in .env")
}
export const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY as string;
if(!FLW_SECRET_KEY){
    throw new Error ("FLW_SECRET_KEY is not defined in .env")
}
export const FLW_ENCRYPTION_KEY = process.env.FLW_ENCRYPTION_KEY as string;
if(!FLW_ENCRYPTION_KEY){
    throw new Error ("FLW_ENCRYPTION_KEY is not defined in .env")
}
export const NODE_ENV = process.env.NODE_ENV as string;
if(!NODE_ENV){
    throw new Error ("NODE_ENV is not defined in .env")
}

export const RESEND_API_KEY = process.env.RESEND_API_KEY as string;
if(!RESEND_API_KEY){
    throw new Error ("RESEND_API_KEY is not defined in .env")
}

export const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY as string;
if(!POSTHOG_API_KEY){
    throw new Error ("POSTHOG_API_KEY is not defined in .env")
}

export const FLW_WEBHOOK_SECRET = process.env.FLW_WEBHOOK_SECRET as string;
if(!FLW_WEBHOOK_SECRET){
    throw new Error ("FLW_WEBHOOK_SECRET is not defined in .env")
}

