// Importing modules
import MenuItemDao from "../../shared/dao/menuItem.dao.js";
import ApiResponse from "../../shared/utils/ApiResponse.util.js";
import ApiError from "../../shared/utils/ApiError.util.js";

// class to handle the public qr menu 
class MenuController {

    constructor() {

        // creating an instance of MenuItemDao
        this.menuItemDao = new MenuItemDao();

    }

    // method to get all menu items for a specific organization
    getMenuItemsByOrganization = async (req, res) => {

        const { orgID } = req.params;

        const organizationId = orgID;

        const menuItems = await this.menuItemDao.findAllMenuItems(organizationId);

        return ApiResponse(res, 200, "Menu items retrieved successfully", { menuItems });

    }

    // method to get all menu items for a specific category
    getMenuItemsByCategory = async (req, res) => {

        const { categoryId } = req.params;

        const menuItems = await this.menuItemDao.findMenuItemsByCategory(categoryId);

        return ApiResponse(res, 200, "Menu items retrieved successfully", { menuItems });

    }


}

export default MenuController;