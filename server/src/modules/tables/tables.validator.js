// Import Modules
import { body } from "express-validator";
import validateErrorMiddleware from "../../shared/middlewares/validateError.middleware.js";

// Validation rules for creating a new menu category
const tableValidationRules = [

    body("name")
        .notEmpty().withMessage("Table name is required")
        .isString().withMessage("Table name must be a string")
        .isLength({ max: 100 }).withMessage("Table name must not exceed 100 characters"),

    body("capacity")
        .notEmpty().withMessage("Table capacity is required")
        .isInt({ min: 1 }).withMessage("Table capacity must be a positive integer"),

    // validating the errors
    validateErrorMiddleware
];

// Validation rules for updating a menu category
const updateTableValidationRules = [

    body("name")
        .optional()
        .isString().withMessage("Table name must be a string")
        .isLength({ max: 100 }).withMessage("Table name must not exceed 100 characters"),

    body("capacity")
        .optional()
        .isInt({ min: 1 }).withMessage("Table capacity must be a positive integer"),

    // validating the errors
    validateErrorMiddleware
];

export { tableValidationRules, updateTableValidationRules };