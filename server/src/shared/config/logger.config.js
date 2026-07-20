// Importing modules
import pino from "pino";
import env from "./env.config.js";

// Create a Pino logger instance with the specified log level from environment variables
const logger = pino({
    level: env.LOGGER_LEVEL,
    transport: {
        target: "pino-pretty", // Use pino-pretty for pretty-printing logs
        options: {
            colorize: true, // Enable colorized output
            translateTime: "SYS:standard", // Format timestamps in a standard way
            ignore: "pid,hostname", // Ignore process ID and hostname in logs
        },
    },
});

// Export the logger instance for use in other parts of the application
export default logger;