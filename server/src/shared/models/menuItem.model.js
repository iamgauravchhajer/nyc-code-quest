// Importing modules
import mongoose from "mongoose";

// defining menu item schema
const menuItemSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    isVeg: {
      type: Boolean,
      default: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    preparationTime: {
      type: Number,
      default: 15,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate menu item names within the same organization
const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;