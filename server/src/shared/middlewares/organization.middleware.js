// Importing modules
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.util.js";
import env from "../config/env.config.js";

function organizationMiddleware(req, res, next) {

    try {

        const organization = req.cookies.organization;

        if (!organization) {
            throw new ApiError(404, "Organization not found in cookies");
        }

        const token = jwt.sign({ organizationId: organization._id }, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN || "7d",
        });

        req.organization = token;

    } catch (err) {
        return next(err);
    }

    return token;
}

export default organizationMiddleware;