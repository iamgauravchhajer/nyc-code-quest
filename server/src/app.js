// Importing modules
import express from "express";
import router from "./shared/router/index.router.js";
import applyMiddlewares from "./shared/middlewares/index.middlewares.js";
import errorHandler from "./shared/middlewares/error.middleware.js";

// function to create the app 
function createApp() {

    // Create an instance of the Express application
    const app = express();

    // apply middlewares
    applyMiddlewares(app);

    // adding the router 
    app.use("/api", router);

    // error handling middleware
    app.use(errorHandler);

    //return the app instance
    return app;

}

export default createApp;