// Importing modules
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.util.js";
import env from "../config/env.config.js";
import MenuItem from "../models/menuItem.model.js";
import MenuCategory from "../models/menuCatageory.model.js";

// Data Access Object (DAO) for MenuItem
class MenuItemDao {

    constructor() {

        // creating an instance of MenuItem model to handle menu item data access operations
        this.menuItemModel = MenuItem;

    }

    // method to create a new menu item
    async createMenuItem(menuItemData) {

        const menuItem = new MenuItem(menuItemData);

        return await menuItem.save();

    }

    // method to find a menu item by its ID
    async findMenuItemById(menuItemId) {

        return await MenuItem.findById(menuItemId);

    }

    // method to update a menu item by its ID
    async updateMenuItem(menuItemId, updateData) {

        return await MenuItem.findByIdAndUpdate(menuItemId, updateData, { returnDocument: "after" });

    }

    // method to delete a menu item by its ID
    async deleteMenuItem(menuItemId) {

        return await MenuItem.findByIdAndDelete(menuItemId);

    }

    // method to find all menu items raw
    async findAllRawMenuItems(organizationId) {

        return await MenuItem.find({ organization: organizationId }).populate("category", "name");

    }

    // method to find all menu items
    async findAllMenuItems(organizationId) {

        return await MenuCategory.aggregate([
            {
                $match: {
                    organization: new mongoose.Types.ObjectId(organizationId),
                    isActive: true,
                },
            },
            {
                $lookup: {
                    from: "menuitems", // MongoDB collection name
                    localField: "_id",
                    foreignField: "category",
                    as: "items",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    sortOrder: 1,
                    items: {
                        $filter: {
                            input: "$items",
                            as: "item",
                            cond: { $eq: ["$$item.isAvailable", true] },
                        },
                    },
                },
            },
            {
                $sort: {
                    sortOrder: 1,
                },
            },
        ]);

    }

    async getMenuGroupedByCategory(categoryId) {

        return await MenuItem.find({ category: categoryId });

    }

    async findMenuItemsByCategory(categoryId) {

        return await MenuItem.find({ category: categoryId });

    }

}

export default MenuItemDao;