// importing modules
import ApiError from "../../shared/utils/ApiError.util.js";
import ApiResponse from "../../shared/utils/ApiResponse.util.js";
import tableDao from "../../shared/dao/tables.dao.js";

// class for table controller
class TableController {

    constructor() {

        // creating an instance of tableDao
        this.tableDao = new tableDao();

    }

    // method to create a new table
    createTable = async (req, res) => {

        const organizationId = req.organization.id;

        const { name, description, capacity } = req.body;

        // check if table already exists
        const existingTable = await this.tableDao.findTableByName(name);

        if (existingTable) {

            throw new ApiError(409, "Table already exists");

        }

        // create new table
        const newTable = await this.tableDao.createTable({

            organization: organizationId,
            name,
            description,
            capacity,
        });

        return ApiResponse(res, 201, "Table created successfully", { table: newTable });

    }

    // method to get all tables
    getAllTables = async (req, res) => {

        const organizationId = req.organization.id;

        const tables = await this.tableDao.findAllTables(organizationId);

        return ApiResponse(res, 200, "Tables retrieved successfully", { tables });

    }

    // update table by ID
    updateTable = async (req, res) => {

        const { tableId } = req.params;

        const { name, description, capacity } = req.body;

        const updatedTable = await this.tableDao.updateTable(tableId, {

            name,
            description,
            capacity,
        });

        if (!updatedTable) {
            throw new ApiError(404, "Table not found");
        }

        return ApiResponse(res, 200, "Table updated successfully", { table: updatedTable });

    }

    // delete table by ID
    deleteTable = async (req, res) => {

        const { tableId } = req.params;

        const deletedTable = await this.tableDao.deleteTable(tableId);

        if (!deletedTable) {
            throw new ApiError(404, "Table not found");
        }

        return ApiResponse(res, 200, "Table deleted successfully", { table: deletedTable });

    }

}

export default TableController;