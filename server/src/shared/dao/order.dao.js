// importing modules
import Order from "../models/order.model.js";

// class to handle order related database operations
class OrderDao {

    // constructor to initialize the OrderDao class
    constructor() {

        this.orderModel = Order;

    }

    // method to create a new order
    async createOrder(orderData) {

        const order = await this.orderModel.create(orderData);

        return order;

    }

    // method to find orders with filters, populated with table and menuItem details
    async findOrders(filter = {}) {

        const orders = await this.orderModel.find(filter)
            .populate("table", "tableNumber status")
            .populate("items.menuItem", "name price category")
            .sort({ createdAt: -1 });

        return orders;

    }

    // method to find a single order by id with all populated details
    async findOrderById(orderId) {

        const order = await this.orderModel.findById(orderId)
            .populate("table", "tableNumber status qrCode")
            .populate("items.menuItem", "name price category image description");

        return order;

    }

    // method to update an order by id
    async updateOrderById(orderId, updateData) {

        const order = await this.orderModel.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true, runValidators: true }
        ).populate("table", "tableNumber status")
         .populate("items.menuItem", "name price");

        return order;

    }

    // method to count total orders for an organization (helpful for order number generation)
    async countOrdersByOrganization(organizationId) {

        const count = await this.orderModel.countDocuments({ organization: organizationId });

        return count;

    }
}

// exporting order dao
export default OrderDao;
