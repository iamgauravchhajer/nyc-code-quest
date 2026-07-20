// Importing modules
import mongoose from "mongoose";
import logger from "./logger.config.js";
import env from "./env.config.js";

// funciton to connect to the database
async function connectDB() {

    // Connect to the MongoDB database using Mongoose
    try {

        await mongoose.connect(env.MONGO_URI);
        logger.info("Connected to MongoDB");

    } catch (error) {
        
        logger.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with an error code

    }

}

export default connectDB;