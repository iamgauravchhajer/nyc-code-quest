// Importing modules
import { body } from "express-validator";
import validateErrorMiddleware from "../../shared/middlewares/validateError.middleware.js";

// Validation rules for creating a new menu item
export const createMenuItemValidationRules = [

    body("name")
        .notEmpty().withMessage("Menu item name is required")
        .isString().withMessage("Menu item name must be a string")
        .isLength({ max: 100 }).withMessage("Menu item name must not exceed 100 characters"),

    body("description")
        .optional()
        .isString().withMessage("Menu item description must be a string")
        .isLength({ max: 500 }).withMessage("Menu item description must not exceed 500 characters"),

    body("price")
        .notEmpty().withMessage("Menu item price is required")
        .isFloat({ min: 0 }).withMessage("Menu item price must be a positive number"),

    body("isVeg")
        .optional()
        .isBoolean().withMessage("Menu item isVeg must be a boolean"),

    body("isAvailable")
        .optional()
        .isBoolean().withMessage("Menu item isAvailable must be a boolean"),

    body("categoryId")
        .notEmpty().withMessage("Menu item categoryId is required")
        .isMongoId().withMessage("Menu item categoryId must be a valid MongoDB ObjectId"),

    // validating the errors
    validateErrorMiddleware
];

// Validation rules for updating a menu item
export const updateMenuItemValidationRules = [

    body("name")
        .optional()
        .isString().withMessage("Menu item name must be a string")
        .isLength({ max: 100 }).withMessage("Menu item name must not exceed 100 characters"),

    body("description")
        .optional()
        .isString().withMessage("Menu item description must be a string")
        .isLength({ max: 500 }).withMessage("Menu item description must not exceed 500 characters"),

    body("price")
        .optional()
        .isFloat({ min: 0 }).withMessage("Menu item price must be a positive number"),

    body("isVeg")
        .optional()
        .isBoolean().withMessage("Menu item isVeg must be a boolean"),

    body("isAvailable")
        .optional()
        .isBoolean().withMessage("Menu item isAvailable must be a boolean"),

    body("categoryId")
        .optional()
        .isMongoId().withMessage("Menu item categoryId must be a valid MongoDB ObjectId"),

    // validating the errors
    validateErrorMiddleware
];

export default {
    createMenuItemValidationRules,
    updateMenuItemValidationRules
};