// importing modules
import express from "express";
import authRouter from "../../modules/auth/auth.router.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import organizationRouter from "../../modules/organization/organization.router.js";
import menuCategoryRouter from "../../modules/menuCategory/menuCategory.router.js";
import menuItemsRouter from "../../modules/menuItems/menuItems.router.js";
import tablesRouter from "../../modules/tables/tables.router.js";
import menuRouter from "../../modules/menu/menu.router.js";
import orderRouter from "../../modules/order/order.router.js";

// creating router instance
const router = express.Router();

// healthy check route
router.get("/health", (req, res) => {
    return ApiResponse(res, 200, "Server is healthy");
});

// mounting auth router
router.use("/auth", authRouter);
router.use("/organizations", organizationRouter);
router.use("/menu-categories", menuCategoryRouter);
router.use("/menu-items", menuItemsRouter);
router.use("/tables", tablesRouter);
router.use("/menu", menuRouter);
router.use("/orders", orderRouter);

export default router;