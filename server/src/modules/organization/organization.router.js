// Importing modules
import env from "../../shared/config/env.config.js";
import express from "express";
import asyncWrapper from "../../shared/utils/asyncWraper.util.js";
import authMiddleware from "../../shared/middlewares/auth.middleware.js";
import OrganizationController from "./organization.controller.js";

// making a router instance
const router = express.Router();

// creating an instance of OrganizationController
const organizationController = new OrganizationController();

/* 

    @route POST /api/organizations
    @desc Create a new organization
    @access Private

*/
router.post("/", authMiddleware, asyncWrapper(organizationController.createOrganization));

/*
    @route GET /api/organizations
    @desc Get organization details
    @access Private
*/
router.get("/", authMiddleware, asyncWrapper(organizationController.getOrganizationDetails));

/*
    @route PUT /api/organizations
    @desc Update organization details
    @access Private
*/
router.put("/", authMiddleware, asyncWrapper(organizationController.updateOrganizationDetails));

/*
    @route DELETE /api/organizations
    @desc Delete organization
    @access Private
*/
router.delete("/", authMiddleware, asyncWrapper(organizationController.deleteOrganization));

export default router;