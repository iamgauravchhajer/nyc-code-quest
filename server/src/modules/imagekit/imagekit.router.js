// Importing modules
import express from "express";
import asyncWrapper from "../../shared/utils/asyncWraper.util.js";
import authMiddleware from "../../shared/middlewares/auth.middleware.js";
import ImagekitController from "./imagekit.controller.js";

// making a router instance
const router = express.Router();

// creating an instance of ImagekitController
const imagekitController = new ImagekitController();

/*

    @route GET /api/imagekit/auth
    @desc Get temporary ImageKit auth parameters
    @access Private

*/
router.get("/auth", authMiddleware, asyncWrapper(imagekitController.getAuthParams));

// exporting router
export default router;
