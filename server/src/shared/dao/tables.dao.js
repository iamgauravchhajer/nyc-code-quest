// importing modules
import Table from "../models/table.model.js";

// class to handle table related database operations
class TableDao {

    constructor() {

        // creating an instance of Table model to handle table data access operations
        this.tableModel = Table;

    }

    // method to create a new table
    async createTable(tableData) {

        const table = new Table(tableData);

        return await table.save();

    }

    // method to find a table by its ID
    async findTableById(tableId) {

        return await Table.findById(tableId);

    }

    // method to update a table by its ID
    async updateTable(tableId, updateData) {

        return await Table.findByIdAndUpdate(tableId, updateData, { returnDocument: "after" });

    }

    // method to delete a table by its ID
    async deleteTable(tableId) {

        return await Table.findByIdAndDelete(tableId);

    }

    // method to find all tables
    async findAllTables(organizationId) {

        return await Table.find({ organization: organizationId, isActive: true });

    }

}

export default TableDao;