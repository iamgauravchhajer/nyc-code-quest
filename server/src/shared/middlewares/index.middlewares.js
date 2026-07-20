// importing modules
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import hpp from "hpp";
import morgan from "morgan";
import env from "../config/env.config.js";

function applyMiddlewares(app) {

    // Apply middlewares based on the environment
    app.use(helmet()); // Security headers
    app.use(cors());
    app.use(cookieParser()); // Parse cookies
    app.use(express.json()); // Parse JSON request bodies
    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
    app.use(compression());
    app.use(hpp());
    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

}

export default applyMiddlewares;