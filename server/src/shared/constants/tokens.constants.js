// Importing modules
import env from "../config/env.config.js";

// constant token configs
export const COOKIE_CONFIG = {
    httpOnly: true,
    secure: env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
}

export const TOKEN_EXPIRES_IN = "7d"; // Token expiration time