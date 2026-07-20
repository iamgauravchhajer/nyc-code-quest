// Importing modules
import MenuCategory from "../models/menuCatageory.model.js";


// class to handle menu category related database operations
class MenuCategoryDao {

    constructor() {

        // creating an instance of MenuCategory model to handle menu category data access operations
        this.menuCategoryModel = MenuCategory;

    }

    // method to create a new menu category
    async createMenuCategory(menuCategoryData) {

        const menuCategory = new MenuCategory(menuCategoryData);

        return await menuCategory.save();
    }

    // method to find a menu category by its ID
    async findMenuCategoryById(menuCategoryId) {

        return await MenuCategory.findById(menuCategoryId);

    }

    // method to update a menu category by its ID
    async updateMenuCategory(menuCategoryId, updateData) {

        return await MenuCategory.findByIdAndUpdate(menuCategoryId, updateData, { returnDocument: "after" });

    }

    // method to delete a menu category by its ID
    async deleteMenuCategory(menuCategoryId) {

        return await MenuCategory.findByIdAndDelete(menuCategoryId);

    }

    // method to find all menu categories
    async findAllMenuCategories(organizationId) {

        return await MenuCategory.find({ organization: organizationId });

    }

    // method to find a menu category by its name
    async findMenuCategoryByName(organizationId, name) {

        return await MenuCategory.findOne({ organization: organizationId, name });

    }

}

export default MenuCategoryDao;