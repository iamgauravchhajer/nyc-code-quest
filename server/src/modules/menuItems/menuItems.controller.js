// Importing modules
import MenuItemDao from "../../shared/dao/menuItem.dao";
import ApiError from "../../shared/utils/ApiError.util";
import ApiResponse from "../../shared/utils/ApiResponse.util";

// class for menu item controller
class MenuItemController {

    constructor() {

        // creating an instance of MenuItemDao
        this.menuItemDao = new MenuItemDao();

    }

    // method to create a new menu item
    createMenuItem = async (req, res) => {

        const organizationId = req.organization.id;

        const { name, description, price, categoryId, isAvailable } = req.body;

        // create new menu item

        const newMenuItem = await this.menuItemDao.createMenuItem({

            organization: organizationId,
            name,
            description,
            price,
            category: categoryId,
            isAvailable,
        });

        return ApiResponse(res, 201, "Menu item created successfully", { menuItem: newMenuItem });
    }

    // method to get all menu items
    getAllMenuItems = async (req, res) => {

        const organizationId = req.organization.id;

        const menuItems = await this.menuItemDao.findAllMenuItems();

        return ApiResponse(res, 200, "Menu items retrieved successfully", { menuItems });
    }

    // update menu item by ID
    updateMenuItem = async (req, res) => {

        const { menuItemId } = req.params;

        const { name, description, price, categoryId, isAvailable } = req.body;

        const updatedMenuItem = await this.menuItemDao.updateMenuItem(menuItemId, {

            name,
            description,
            price,
            category: categoryId,
            isAvailable,
        });

        if (!updatedMenuItem) {
            throw new ApiError(404, "Menu item not found");
        }
        return ApiResponse(res, 200, "Menu item updated successfully", { menuItem: updatedMenuItem });
    }

    // delete menu item by ID
    deleteMenuItem = async (req, res) => {

        const { menuItemId } = req.params;

        const deletedMenuItem = await this.menuItemDao.deleteMenuItem(menuItemId);

        if (!deletedMenuItem) {

            throw new ApiError(404, "Menu item not found");

        }

        return ApiResponse(res, 200, "Menu item deleted successfully", { menuItem: deletedMenuItem });

    }

    // method to get menu items grouped by category
    getMenuGroupedByCategory = async (req, res) => {

        const { categoryId } = req.params;

        const menuGroupedByCategory = await this.menuItemDao.getMenuGroupedByCategory(categoryId);

        return ApiResponse(res, 200, "Menu items grouped by category retrieved successfully", { menuGroupedByCategory });

    }

}

