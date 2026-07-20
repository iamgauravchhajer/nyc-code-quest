// Importing modules
import express from "express";
import asyncWrapper from "../../shared/utils/asyncWraper.util.js";
import authMiddleware from "../../shared/middlewares/auth.middleware.js";
import organizationMiddleware from "../../shared/middlewares/organization.middleware.js";
import MenuItemsController from "./menuItems.controller.js";
import { createMenuItemValidationRules, updateMenuItemValidationRules } from "./menuItem.validator.js";

// Making router instance
const router = express.Router();

// Creating an instance of MenuItemsController
const menuItemsController = new MenuItemsController();

/*
    @route POST /api/menu-items
    @desc Create a new menu item
    @access Private
*/
router.post("/", authMiddleware, organizationMiddleware, createMenuItemValidationRules, asyncWrapper(menuItemsController.createMenuItem));

/*
    @route GET /api/menu-items
    @desc Get all menu items
    @access Private
*/
router.get("/", authMiddleware, organizationMiddleware, asyncWrapper(menuItemsController.getAllMenuItems));

/*
    @route PUT /api/menu-items/:menuItemId
    @desc Update a menu item by ID
    @access Private
*/
router.put("/:menuItemId", authMiddleware, organizationMiddleware, updateMenuItemValidationRules, asyncWrapper(menuItemsController.updateMenuItem));

/*
    @route DELETE /api/menu-items/:menuItemId
    @desc Delete a menu item by ID
    @access Private
*/
router.delete("/:menuItemId", authMiddleware, organizationMiddleware, asyncWrapper(menuItemsController.deleteMenuItem));

/* 
    @route GET /api/menu-items/:categoryId
    @desc Get menu items grouped by category
    @access Private
*/
router.get("/:categoryId", authMiddleware, organizationMiddleware, asyncWrapper(menuItemsController.getMenuGroupedByCategory));

    export default router;