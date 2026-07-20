import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            default: "",
        },
        city: {
            type: String,
            trim: true,
            default: "",
        },
        orders: {
            type: Number,
            default: 0,
        },
        spent: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate customer phone number per organization
customerSchema.index({ organization: 1, phone: 1 }, { unique: true });

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
