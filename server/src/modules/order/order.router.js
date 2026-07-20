// Importing modules
import express from "express";
import asyncWrapper from "../../shared/utils/asyncWraper.util.js";
import authMiddleware from "../../shared/middlewares/auth.middleware.js";
import organizationMiddleware from "../../shared/middlewares/organization.middleware.js";
import OrderController from "./order.controller.js";
import {
    createOrderValidationRules,
    updateOrderStatusValidationRules,
    updateOrderPaymentValidationRules
} from "./order.validator.js";

// making a router instance
const router = express.Router();

// creating an instance of OrderController
const orderController = new OrderController();

/*

    @route POST /api/orders
    @desc Place a new order
    @access Private (Auth + Org)

*/
router.post("/", authMiddleware, organizationMiddleware, createOrderValidationRules, asyncWrapper(orderController.createOrder));

/*

    @route GET /api/orders
    @desc Get all orders for the organization (with optional filtering)
    @access Private (Auth + Org)

*/
router.get("/", authMiddleware, organizationMiddleware, asyncWrapper(orderController.getAllOrders));

/*

    @route GET /api/orders/:orderId
    @desc Get details of a single order
    @access Private (Auth + Org)

*/
router.get("/:orderId", authMiddleware, organizationMiddleware, asyncWrapper(orderController.getOrderDetails));

/*

    @route PUT /api/orders/:orderId/status
    @desc Update order status (preparing, served, completed, cancelled)
    @access Private (Auth + Org)

*/
router.put("/:orderId/status", authMiddleware, organizationMiddleware, updateOrderStatusValidationRules, asyncWrapper(orderController.updateOrderStatus));

/*

    @route PUT /api/orders/:orderId/payment
    @desc Update order payment details (paid, refunded)
    @access Private (Auth + Org)

*/
router.put("/:orderId/payment", authMiddleware, organizationMiddleware, updateOrderPaymentValidationRules, asyncWrapper(orderController.updateOrderPayment));

// exporting router
export default router;
