// importing modules
import express from "express";
import AuthController from "./auth.controller.js";
import { loginValidationRules, signupValidationRules } from "./auth.validator.js";
import asyncWrapper from "../../shared/utils/asyncWraper.util.js";

// creating router instance
const router = express.Router();

// creating an instance of AuthController
const authController = new AuthController();

/*

    @route POST /api/auth/signup
    @desc Register a new user
    @access Public

*/
router.post("/signup", signupValidationRules , asyncWrapper(authController.signup));

/*
    @route POST /api/auth/login
    @desc Login a user
    @access Public
*/
router.post("/login", loginValidationRules, asyncWrapper(authController.login));

export default router;