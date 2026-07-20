// Import Modules
import { body } from "express-validator";
import validateErrorMiddleware from "../../shared/middlewares/validateError.middleware.js";

// Validation rules for creating a new order
const createOrderValidationRules = [

    body("tableId")
        .notEmpty().withMessage("Table ID is required")
        .isMongoId().withMessage("Invalid Table ID format"),

    body("items")
        .isArray({ min: 1 }).withMessage("Items must be a non-empty array"),

    body("items.*.menuItemId")
        .notEmpty().withMessage("Menu item ID is required")
        .isMongoId().withMessage("Invalid Menu item ID format"),

    body("items.*.quantity")
        .notEmpty().withMessage("Quantity is required")
        .isInt({ min: 1 }).withMessage("Quantity must be an integer of at least 1"),

    // validating the errors
    validateErrorMiddleware
];

// Validation rules for updating order status
const updateOrderStatusValidationRules = [

    body("status")
        .notEmpty().withMessage("Status is required")
        .isIn(["pending", "preparing", "served", "completed", "cancelled"])
        .withMessage("Invalid status value. Must be pending, preparing, served, completed, or cancelled"),

    // validating the errors
    validateErrorMiddleware
];

// Validation rules for updating order payment details
const updateOrderPaymentValidationRules = [

    body("paymentStatus")
        .notEmpty().withMessage("Payment status is required")
        .isIn(["pending", "paid", "refunded"])
        .withMessage("Invalid payment status. Must be pending, paid, or refunded"),

    body("paymentMethod")
        .optional()
        .isIn(["cash", "card", "upi", "online"])
        .withMessage("Invalid payment method. Must be cash, card, upi, or online"),

    // validating the errors
    validateErrorMiddleware
];

// Exporting validation rules
export {
    createOrderValidationRules,
    updateOrderStatusValidationRules,
    updateOrderPaymentValidationRules
};
