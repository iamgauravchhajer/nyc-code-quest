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

        const decoded = jwt.verify(organization, env.JWT_SECRET);

        req.organization = decoded;
        next();

    } catch (err) {
        return next(err);
    }
}

export default organizationMiddleware;