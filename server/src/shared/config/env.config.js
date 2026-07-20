// Imoprting modules 
import { config } from "dotenv";
import z from "zod";
import envConstants from "../constants/env.constant.js";
import e from "express";

// Load environment variables from .env file
config();

// Define a schema for environment variables using zod
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default(envConstants.NODE_ENV),
    PORT: z.coerce.number().default(envConstants.PORT),
    MONGO_URI: z.string().default(envConstants.MONGO_URI),
    SMTP_MAIL: z.coerce.boolean().default(envConstants.SMTP_MAIL),
    LOGGER_LEVEL: z.string().default(envConstants.LOGGER_LEVEL),
    JWT_SECRET: z.string().default(envConstants.JWT_SECRET),
    CORS_ORIGIN: z.string().default(envConstants.CORS_ORIGIN),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

// If validation fails, throw an error with details
if (!parsedEnv.success) {
    console.error("Invalid environment variables:", parsedEnv.error.format());
    process.exit(1); // Exit the process with an error code
}

// making the enc 
const env = parsedEnv.data;

// Export the validated environment variables
export default env;
