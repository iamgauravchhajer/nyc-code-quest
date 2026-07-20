// importing modules
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.util.js";
import env from "../config/env.config.js";

function authMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return next(new ApiError(401, "Unauthorized"));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        return next();
    }
    catch (err) {
        return next(new ApiError(401, "Unauthorized"));
    }

}

export default authMiddleware;