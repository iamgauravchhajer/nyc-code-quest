// Importing modules
import { body } from "express-validator";
import validateErrorMiddleware from "../../shared/middlewares/validateError.middleware.js";

// Validation rules for creating a new menu category
export const createMenuCategoryValidationRules = [

    body("name")
        .notEmpty().withMessage("Menu category name is required")
        .isString().withMessage("Menu category name must be a string")
        .isLength({ max: 100 }).withMessage("Menu category name must not exceed 100 characters"),

    body("description")
        .optional()
        .isString().withMessage("Menu category description must be a string")
        .isLength({ max: 500 }).withMessage("Menu category description must not exceed 500 characters"),

    // validating the errors 
    validateErrorMiddleware
];

// Validation rules for updating a menu category
export const updateMenuCategoryValidationRules = [

    // validating the name field
    body("name")
        .optional()
        .isString().withMessage("Menu category name must be a string")
        .isLength({ max: 100 }).withMessage("Menu category name must not exceed 100 characters"),

    // validating the description field
    body("description")
        .optional()
        .isString().withMessage("Menu category description must be a string")
        .isLength({ max: 500 }).withMessage("Menu category description must not exceed 500 characters"),

    // validating the errors
    validateErrorMiddleware
];

export default {
    createMenuCategoryValidationRules,
    updateMenuCategoryValidationRules
};