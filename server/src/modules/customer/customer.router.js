import express from "express";
import asyncWrapper from "../../shared/utils/asyncWraper.util.js";
import authMiddleware from "../../shared/middlewares/auth.middleware.js";
import organizationMiddleware from "../../shared/middlewares/organization.middleware.js";
import CustomerController from "./customer.controller.js";

const router = express.Router();
const customerController = new CustomerController();

router.post("/", authMiddleware, organizationMiddleware, asyncWrapper(customerController.createCustomer));
router.get("/", authMiddleware, organizationMiddleware, asyncWrapper(customerController.getAllCustomers));
router.put("/:customerId", authMiddleware, organizationMiddleware, asyncWrapper(customerController.updateCustomer));
router.delete("/:customerId", authMiddleware, organizationMiddleware, asyncWrapper(customerController.deleteCustomer));

export default router;
