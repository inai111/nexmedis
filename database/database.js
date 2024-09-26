import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
export const connectToDB = async ()=>{
    try{
        const mongoUrl = process.env.MONGO_URL;
        await mongoose.connect(mongoUrl);
        console.log("Mongodb success to connect");
    }catch(err){
        console.log(err.message);
    }
}