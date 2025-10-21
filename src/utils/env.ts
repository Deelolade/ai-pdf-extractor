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


