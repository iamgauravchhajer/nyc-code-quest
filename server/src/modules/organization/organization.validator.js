// Organization validator functions
import { body } from "express-validator";
import validateErrorMiddleware from "../../shared/middlewares/validateError.middleware.js";

const organizationValidationRules = [

    // validating name
    body("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),

    // validating the description
    body("description")
        .notEmpty().withMessage("Description is required")
        .isLength({ min: 10 }).withMessage("Description must be at least 10 characters long"),

    // validating the phone number
    body("phone")
        .notEmpty().withMessage("Phone number is required")
        .isMobilePhone().withMessage("Invalid phone number"),

    // validating the website
    body("website")
        .optional()
        .isURL().withMessage("Invalid website URL"),

    // validating the address
    body("address")
        .optional()
        .isObject().withMessage("Address must be an object"),

    // validating the opening time
    body("openingTime")
        .notEmpty().withMessage("Opening time is required")
        .matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage("Invalid opening time format"),

    // validating the closing time
    body("closingTime")
        .notEmpty().withMessage("Closing time is required")
        .matches(/^([01]\d|2[0-3]):?([0-5]\d)$/).withMessage("Invalid closing time format"),

    // validating the GST number
    body("gstNumber")
        .optional()
        .isLength({ min: 15, max: 15 }).withMessage("GST number must be 15 characters long"),

    // validating the FSSAI number
    body("fssaiNumber")
        .optional()
        .isLength({ min: 14, max: 14 }).withMessage("FSSAI number must be 14 characters long"),

    // validating the PAN number
    body("panNumber")
        .optional()
        .isLength({ min: 10, max: 10 }).withMessage("PAN number must be 10 characters long"),

    // validate errors
    validateErrorMiddleware
];

export default organizationValidationRules;