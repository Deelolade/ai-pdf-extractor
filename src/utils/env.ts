import { config } from "dotenv"
config();

export const MONGODB_URL = process.env.MONGODB_URL as string;
if(!MONGODB_URL){
    throw new Error ("MONGODB_URL is not defined in .env")
}