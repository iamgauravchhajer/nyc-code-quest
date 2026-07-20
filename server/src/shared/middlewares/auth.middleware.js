// importing modules
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.util.js";
import env from "../config/env.config.js";

function authMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        throw new ApiError(401, "Unauthorized");
    }

    next();

}

export default authMiddleware;