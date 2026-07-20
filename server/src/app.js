// Importing modules
import express from "express";
import router from "./shared/router/index.router.js";
import applyMiddlewares from "./shared/middlewares/index.middlewares.js";
import errorHandler from "./shared/middlewares/error.middleware.js";
import path from "path";
import { fileURLToPath } from "url";

// function to create the app 
function createApp() {

    // Create an instance of the Express application
    const app = express();

    // apply middlewares
    applyMiddlewares(app);

    // adding the router 
    app.use("/api", router);

    // Serve static files from the "public" directory
    const __filename = fileURLToPath(import.meta.url);

    // Get the directory name of the current module
    const __dirname = path.dirname(__filename);

    // Serve static files from the "public" directory
    app.use(express.static(path.join(__dirname, "..", "public")));

    // SPA catch-all: serve index.html for all non-API routes so React Router handles them
    app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api")) {
            return next();
        }
        res.sendFile(path.join(__dirname, "..", "public", "index.html"));
    });

    // error handling middleware
    app.use(errorHandler);

    //return the app instance
    return app;

}

export default createApp;