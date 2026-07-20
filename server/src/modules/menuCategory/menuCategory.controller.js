// Importing modules
import MenuCategoryDao from "../../shared/dao/menuCatageory.dao.js";
import ApiError from "../../shared/utils/ApiError.util.js";
import ApiResponse from "../../shared/utils/ApiResponse.util.js";

// class for menu category controller
class MenuCategoryController {

    constructor() {

        // creating an instance of MenuCategoryDao
        this.menuCategoryDao = new MenuCategoryDao();

    }

    // method to create a new menu category
    createMenuCategory = async (req, res) => {

        const organizationId = req.organization.id;

        const { name, description } = req.body;

        // check if menu category already exists
        const existingMenuCategory = await this.menuCategoryDao.findMenuCategoryByName(name);

        if (existingMenuCategory) {

            throw new ApiError(409, "Menu category already exists");

        }

        // create new menu category
        const newMenuCategory = await this.menuCategoryDao.createMenuCategory({

            organization: organizationId,
            name,
            description,

        });

        return ApiResponse(res, 201, "Menu category created successfully", { menuCategory: newMenuCategory });
    }


    // method to get all menu categories
    getAllMenuCategories = async (req, res) => {

        const menuCategories = await this.menuCategoryDao.findAllMenuCategories();

        return ApiResponse(res, 200, "Menu categories retrieved successfully", { menuCategories });

    }

    // update menu category by ID
    updateMenuCategory = async (req, res) => {

        const { menuCategoryId } = req.params;

        const { name, description } = req.body;

        // check if menu category exists
        const existingMenuCategory = await this.menuCategoryDao.findMenuCategoryById(menuCategoryId);

        if (!existingMenuCategory) {

            throw new ApiError(404, "Menu category not found");

        }

        // update menu category
        const updatedMenuCategory = await this.menuCategoryDao.updateMenuCategory(menuCategoryId, {

            name,
            description,
        });

        return ApiResponse(res, 200, "Menu category updated successfully", { menuCategory: updatedMenuCategory });

    }

    // delete menu category by ID
    deleteMenuCategory = async (req, res) => {

        const { menuCategoryId } = req.params;

        // check if menu category exists
        const existingMenuCategory = await this.menuCategoryDao.findMenuCategoryById(menuCategoryId);

        if (!existingMenuCategory) {

            throw new ApiError(404, "Menu category not found");

        }

        // delete menu category
        await this.menuCategoryDao.deleteMenuCategory(menuCategoryId);

        return ApiResponse(res, 200, "Menu category deleted successfully");

    }

}

export default MenuCategoryController;