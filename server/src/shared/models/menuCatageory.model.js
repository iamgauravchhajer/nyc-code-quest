import mongoose from "mongoose";

const menuCategorySchema = new mongoose.Schema(
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
      maxlength: 50,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 255,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate category names within the same organization
menuCategorySchema.index(
  { organization: 1, name: 1 },
  { unique: true }
);

const MenuCategory = mongoose.model("MenuCategory", menuCategorySchema);

export default MenuCategory;