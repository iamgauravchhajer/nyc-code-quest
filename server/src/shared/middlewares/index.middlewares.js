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
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "img-src": ["'self'", "data:", "blob:", "https://images.higgs.ai", "https://*.higgs.ai", "https://api.qrserver.com"],
                "connect-src": ["'self'", "https://api.qrserver.com"],
            },
        },
    }));
    app.use(cors({
        origin: env.CORS_ORIGIN,
        credentials: true
    }));
    app.use(cookieParser()); // Parse cookies
    app.use(express.json()); // Parse JSON request bodies
    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
    app.use(compression());
    app.use(hpp());
    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

}

export default applyMiddlewares;