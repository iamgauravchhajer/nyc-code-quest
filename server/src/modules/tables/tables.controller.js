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

        const { tableNumber, capacity } = req.body;

        // check if table number already exists in this organization
        const existingTable = await this.tableDao.findTableByNumber(organizationId, tableNumber);

        if (existingTable) {

            throw new ApiError(409, `Table number ${tableNumber} already exists`);

        }

        // generate table QR code string
        const qrCodeUrl = `/menu/${organizationId}?table=${tableNumber}`;

        // create new table
        const newTable = await this.tableDao.createTable({
            organization: organizationId,
            tableNumber,
            capacity,
            status: "available",
            qrCode: qrCodeUrl
        });

        return ApiResponse(res, 201, "Table created successfully", { table: newTable });

    }

    // method to get all tables
    getAllTables = async (req, res) => {

        const organizationId = req.organization.id;

        const tables = await this.tableDao.findAllTables(organizationId);

        // Sort tables by tableNumber ascending
        tables.sort((a, b) => a.tableNumber - b.tableNumber);

        return ApiResponse(res, 200, "Tables retrieved successfully", { tables });

    }

    // update table by ID
    updateTable = async (req, res) => {

        const organizationId = req.organization.id;

        const { tableId } = req.params;

        const { tableNumber, capacity, status } = req.body;

        // check if the tableNumber we are updating to is already occupied by another table
        if (tableNumber) {

            const existingTable = await this.tableDao.findTableByNumber(organizationId, tableNumber);

            if (existingTable && existingTable._id.toString() !== tableId) {

                throw new ApiError(409, `Table number ${tableNumber} is already in use`);

            }

        }

        const updateData = {};

        if (tableNumber) {

            updateData.tableNumber = tableNumber;
            updateData.qrCode = `/menu/${organizationId}?table=${tableNumber}`;

        }

        if (capacity) {

            updateData.capacity = capacity;

        }

        if (status) {

            updateData.status = status;

        }

        const updatedTable = await this.tableDao.updateTable(tableId, updateData);

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