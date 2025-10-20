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