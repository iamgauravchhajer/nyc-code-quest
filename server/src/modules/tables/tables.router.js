// Importing modules
import express from "express";
import asyncWrapper from "../../shared/utils/asyncWraper.util.js";
import authMiddleware from "../../shared/middlewares/auth.middleware.js";
import organizationMiddleware from "../../shared/middlewares/organization.middleware.js";
import TablesController from "./tables.controller.js";
import { createTableValidationRules, updateTableValidationRules } from "./tables.validator.js";

// Making router instance
const router = express.Router();

// Creating an instance of TablesController
const tablesController = new TablesController();

/*
    @route POST /api/tables
    @desc Create a new table
    @access Private
*/
router.post("/", authMiddleware, organizationMiddleware, createTableValidationRules, asyncWrapper(tablesController.createTable));

/*
    @route GET /api/tables
    @desc Get all tables
    @access Private
*/
router.get("/", authMiddleware, organizationMiddleware, asyncWrapper(tablesController.getAllTables));

/*
    @route PUT /api/tables/:tableId
    @desc Update a table by ID
    @access Private
*/
router.put("/:tableId", authMiddleware, organizationMiddleware, updateTableValidationRules, asyncWrapper(tablesController.updateTable));

/*
    @route DELETE /api/tables/:tableId
    @desc Delete a table by ID
    @access Private
*/
router.delete("/:tableId", authMiddleware, organizationMiddleware, asyncWrapper(tablesController.deleteTable));

export default router;