import mongoose from "mongoose"
import { MONGODB_URL } from "./env"

export const connectDb = async()=>{
    try {
        await mongoose.connect(MONGODB_URL);
        console.log(`connected to mongpdb successfully !!`) 
    } catch (error) {
        console.log('error connecting to mongodb', error)
        process.exit(1);
    }
}