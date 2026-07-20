import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.util.js";

// middleware to handle validation errors
export const validateErrorMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        const message = errors.array()[0]?.msg || "Validation failed";
        
        throw new ApiError(400, message);
    }

    next();
};

export default validateErrorMiddleware;