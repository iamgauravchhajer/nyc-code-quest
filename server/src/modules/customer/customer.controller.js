import CustomerDao from "../../shared/dao/customer.dao.js";
import ApiError from "../../shared/utils/ApiError.util.js";
import ApiResponse from "../../shared/utils/ApiResponse.util.js";

class CustomerController {
    constructor() {
        this.customerDao = new CustomerDao();
    }

    createCustomer = async (req, res) => {
        const organizationId = req.organization.id;
        const { name, phone, email, city } = req.body;

        const existingCustomer = await this.customerDao.findCustomerByPhone(organizationId, phone);
        if (existingCustomer) {
            throw new ApiError(409, `Customer with phone number ${phone} already exists`);
        }

        const newCustomer = await this.customerDao.createCustomer({
            organization: organizationId,
            name,
            phone,
            email,
            city,
            orders: 0,
            spent: 0
        });

        return ApiResponse(res, 201, "Customer created successfully", { customer: newCustomer });
    }

    getAllCustomers = async (req, res) => {
        const organizationId = req.organization.id;
        const customers = await this.customerDao.findAllCustomers(organizationId);
        return ApiResponse(res, 200, "Customers retrieved successfully", { customers });
    }

    updateCustomer = async (req, res) => {
        const organizationId = req.organization.id;
        const { customerId } = req.params;
        const { name, phone, email, city, orders, spent } = req.body;

        if (phone) {
            const existingCustomer = await this.customerDao.findCustomerByPhone(organizationId, phone);
            if (existingCustomer && existingCustomer._id.toString() !== customerId) {
                throw new ApiError(409, `Customer with phone number ${phone} already exists`);
            }
        }

        const updatedCustomer = await this.customerDao.updateCustomer(customerId, {
            name,
            phone,
            email,
            city,
            orders,
            spent
        });

        if (!updatedCustomer) {
            throw new ApiError(404, "Customer not found");
        }

        return ApiResponse(res, 200, "Customer updated successfully", { customer: updatedCustomer });
    }

    deleteCustomer = async (req, res) => {
        const { customerId } = req.params;
        const deletedCustomer = await this.customerDao.deleteCustomer(customerId);

        if (!deletedCustomer) {
            throw new ApiError(404, "Customer not found");
        }

        return ApiResponse(res, 200, "Customer deleted successfully", { customer: deletedCustomer });
    }
}

export default CustomerController;
