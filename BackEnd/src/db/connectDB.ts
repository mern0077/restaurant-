import mongoose from "mongoose";
// import dotenv from "dotenv";

export const connectDB = async () => {
    try {
        // await mongoose.connect(process.env.DATABASE_URL as string); or
        const database = await mongoose.connect(process.env.DATABASE_URL!);
        // console.log("successfully connected : ", database); // to see into databse url
        console.log("successfully connected : ");
    } catch (error: any) {
        console.log("Error from database : ", error.message);
    }
}