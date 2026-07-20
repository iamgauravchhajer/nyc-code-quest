// Importing module
import mongoose from "mongoose";

// defining menu item schema
// defining table schema
const tableSchema = new mongoose.Schema(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true,
        },

        tableNumber: {
            type: Number,
            required: true,
            min: 1,
            unique: true,
        },

        status: {
            type: String,
            enum: ["available", "occupied", "reserved", "cleaning"],
            default: "available",
        },

        qrCode: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Making the model for table
const Table = mongoose.model("Table", tableSchema);

export default Table;