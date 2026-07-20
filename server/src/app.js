// Importing modules
import express from "express";
import router from "./shared/router/index.router.js";

// function to create the app 
function createApp() {

    // Create an instance of the Express application
    const app = express();

    // adding the router 
    app.use("/api", router);

    //return the app instance
    return app;

}

export default createApp;