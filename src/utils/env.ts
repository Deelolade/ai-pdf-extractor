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