// Importing modules
import express from "express";
import asyncWrapper from "../../shared/utils/asyncWraper.util.js";
import authMiddleware from "../../shared/middlewares/auth.middleware.js";
import MenuCategoryController from "./menuCategory.controller.js";
import organizationMiddleware from "../../shared/middlewares/organization.middleware.js";
import { createMenuCategoryValidationRules, updateMenuCategoryValidationRules } from "./menu.validator.js";

// creating router instance
const router = express.Router();

// creating an instance of MenuCategoryController
const menuCategoryController = new MenuCategoryController();

/* 
    @route POST /api/menu-categories
    @desc Create a new menu category
    @access Private
*/
router.post("/", authMiddleware, organizationMiddleware, createMenuCategoryValidationRules, asyncWrapper(menuCategoryController.createMenuCategory));

/*
    @route GET /api/menu-categories
    @desc Get all menu categories
    @access Private
*/
router.get("/", authMiddleware, organizationMiddleware, asyncWrapper(menuCategoryController.getAllMenuCategories));

/*
    @route PUT /api/menu-categories/:menuCategoryId
    @desc Update a menu category by ID
    @access Private
*/
router.put("/:menuCategoryId", authMiddleware, organizationMiddleware, updateMenuCategoryValidationRules, asyncWrapper(menuCategoryController.updateMenuCategory));

/*
    @route DELETE /api/menu-categories/:menuCategoryId
    @desc Delete a menu category by ID
    @access Private
*/
router.delete("/:menuCategoryId", authMiddleware, organizationMiddleware, asyncWrapper(menuCategoryController.deleteMenuCategory));

export default router;