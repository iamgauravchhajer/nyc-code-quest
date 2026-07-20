// Importing modules
import createApp from "./src/app.js";
import env from "./src/shared/config/env.config.js";
import logger from "./src/shared/config/logger.config.js";

// function to start the server
function startServer() {

    // Create an instance of the Express application
    const app = createApp();

    // Start the server and listen on the specified port
    app.listen(env.PORT, () => {
        logger.info(`Server is running on port ${env.PORT}`);
    });

}

// Start the server
startServer();