// importing modules
import ApiError from "../../shared/utils/ApiError.util.js";
import ApiResponse from "../../shared/utils/ApiResponse.util.js";
import OrderDao from "../../shared/dao/order.dao.js";
import TableDao from "../../shared/dao/tables.dao.js";
import MenuItemDao from "../../shared/dao/menuItem.dao.js";

// class for order controller
class OrderController {

    constructor() {

        // creating instances of required DAOs
        this.orderDao = new OrderDao();
        this.tableDao = new TableDao();
        this.menuItemDao = new MenuItemDao();

    }

    // method to place a new order
    createOrder = async (req, res) => {

        const organizationId = req.organization.id;

        const { tableId, items } = req.body;

        // check if table exists and belongs to the organization
        const table = await this.tableDao.findTableById(tableId);

        if (!table || table.organization.toString() !== organizationId) {

            throw new ApiError(404, "Table not found");

        }

        const orderItems = [];

        let totalAmount = 0;

        // verify menu items and securely calculate prices & total amount
        for (const item of items) {

            const menuItem = await this.menuItemDao.findMenuItemById(item.menuItemId);

            if (!menuItem || menuItem.organization.toString() !== organizationId) {

                throw new ApiError(404, `Menu item not found: ${item.menuItemId}`);

            }

            if (!menuItem.isAvailable) {

                throw new ApiError(400, `Menu item "${menuItem.name}" is currently unavailable`);

            }

            const currentPrice = menuItem.price;

            orderItems.push({
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: currentPrice
            });

            totalAmount += currentPrice * item.quantity;

        }

        // generate unique order number
        const orderCount = await this.orderDao.countOrdersByOrganization(organizationId);

        const orderNumber = `ORD-${Date.now().toString().slice(-4)}-${orderCount + 1}`;

        // create the order
        const newOrder = await this.orderDao.createOrder({
            organization: organizationId,
            table: tableId,
            items: orderItems,
            totalAmount,
            status: "pending",
            paymentStatus: "pending",
            orderNumber
        });

        // automatically mark the table as occupied
        await this.tableDao.updateTable(tableId, { status: "occupied" });

        return ApiResponse(res, 201, "Order placed successfully", { order: newOrder });

    }

    // method to get all orders for the organization (with optional filtering)
    getAllOrders = async (req, res) => {

        const organizationId = req.organization.id;

        const { status, paymentStatus, tableId } = req.query;

        const filter = { organization: organizationId };

        if (status) {

            filter.status = status;

        }

        if (paymentStatus) {

            filter.paymentStatus = paymentStatus;

        }

        if (tableId) {

            filter.table = tableId;

        }

        const orders = await this.orderDao.findOrders(filter);

        return ApiResponse(res, 200, "Orders retrieved successfully", { orders });

    }

    // method to get a single order's details
    getOrderDetails = async (req, res) => {

        const organizationId = req.organization.id;

        const { orderId } = req.params;

        const order = await this.orderDao.findOrderById(orderId);

        if (!order || order.organization.toString() !== organizationId) {

            throw new ApiError(404, "Order not found");

        }

        return ApiResponse(res, 200, "Order details retrieved successfully", { order });

    }

    // method to update order preparation / fulfillment status
    updateOrderStatus = async (req, res) => {

        const organizationId = req.organization.id;

        const { orderId } = req.params;

        const { status } = req.body;

        // verify order exists
        const order = await this.orderDao.findOrderById(orderId);

        if (!order || order.organization.toString() !== organizationId) {

            throw new ApiError(404, "Order not found");

        }

        // update status
        const updatedOrder = await this.orderDao.updateOrderById(orderId, { status });

        // if order is completed or cancelled, release the table status back to available
        if (status === "completed" || status === "cancelled") {

            await this.tableDao.updateTable(order.table._id, { status: "available" });

        }

        return ApiResponse(res, 200, "Order status updated successfully", { order: updatedOrder });

    }

    // method to update order payment status
    updateOrderPayment = async (req, res) => {

        const organizationId = req.organization.id;

        const { orderId } = req.params;

        const { paymentStatus, paymentMethod } = req.body;

        // verify order exists
        const order = await this.orderDao.findOrderById(orderId);

        if (!order || order.organization.toString() !== organizationId) {

            throw new ApiError(404, "Order not found");

        }

        const updateFields = { paymentStatus };

        if (paymentMethod) {

            updateFields.paymentMethod = paymentMethod;

        }

        const updatedOrder = await this.orderDao.updateOrderById(orderId, updateFields);

        return ApiResponse(res, 200, "Order payment status updated successfully", { order: updatedOrder });

    }
}

// exporting order controller
export default OrderController;
