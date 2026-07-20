// Import Modules
import { body } from "express-validator";
import validateErrorMiddleware from "../../shared/middlewares/validateError.middleware.js";

// Validation rules for creating a new table
const tableValidationRules = [

    body("tableNumber")
        .notEmpty().withMessage("Table number is required")
        .isInt({ min: 1 }).withMessage("Table number must be a positive integer"),

    body("capacity")
        .notEmpty().withMessage("Table capacity is required")
        .isInt({ min: 1 }).withMessage("Table capacity must be a positive integer"),

    // validating the errors
    validateErrorMiddleware
];

// Validation rules for updating a table
const updateTableValidationRules = [

    body("tableNumber")
        .optional()
        .isInt({ min: 1 }).withMessage("Table number must be a positive integer"),

    body("capacity")
        .optional()
        .isInt({ min: 1 }).withMessage("Table capacity must be a positive integer"),

    // validating the errors
    validateErrorMiddleware
];

export { tableValidationRules, updateTableValidationRules };