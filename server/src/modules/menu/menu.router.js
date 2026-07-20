// Importing modules
import express from "express";
import asyncWrapper from "../../shared/utils/asyncWraper.util.js";
import menuController from "./menu.controller.js";

// making a router instance
const router = express.Router();

// making an instance of menuController
const menuControllerInstance = new menuController();

/* 
    @route GET /api/menu/:orgID
    @desc Get menu items for a specific organization
    @access public
*/
router.get("/:orgID", asyncWrapper(menuControllerInstance.getMenuItemsByOrganization));

/* 
    @route GET /api/menu/category/:categoryId
    @desc Get menu items for a specific category
    @access public
*/
router.get("/:categoryId", asyncWrapper(menuControllerInstance.getMenuItemsByCategory));

export default router;