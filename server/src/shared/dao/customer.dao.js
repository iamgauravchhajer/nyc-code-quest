import Customer from "../models/customer.model.js";

class CustomerDao {
    constructor() {
        this.customerModel = Customer;
    }

    async createCustomer(customerData) {
        const customer = new Customer(customerData);
        return await customer.save();
    }

    async findCustomerById(customerId) {
        return await Customer.findById(customerId);
    }

    async findCustomerByPhone(organizationId, phone) {
        return await Customer.findOne({ organization: organizationId, phone });
    }

    async updateCustomer(customerId, updateData) {
        return await Customer.findByIdAndUpdate(customerId, updateData, { new: true, runValidators: true });
    }

    async deleteCustomer(customerId) {
        return await Customer.findByIdAndDelete(customerId);
    }

    async findAllCustomers(organizationId) {
        return await Customer.find({ organization: organizationId }).sort({ name: 1 });
    }
}

export default CustomerDao;
