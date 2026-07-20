// importing modules
import mongoose from "mongoose";

// defining order item schema
const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    }
});

// defining order schema
const orderSchema = new mongoose.Schema(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Table",
            required: true,
            index: true,
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: [v => v && v.length > 0, "Order must contain at least one item"]
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["pending", "preparing", "served", "completed", "cancelled"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "refunded"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "card", "upi", "online"],
        },
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        }
    },
    {
        timestamps: true,
    }
);

// creating order model
const Order = mongoose.model("Order", orderSchema);

// exporting order model
export default Order;
