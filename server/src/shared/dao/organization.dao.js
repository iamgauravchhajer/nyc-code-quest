// importing modules
import Organization from "../models/organization.model.js";

// class to handle organization related database operations
class OrganizationDao {
    
    constructor() {

        // creating an instance of Organization model to handle organization data access operations
        this.organizationModel = Organization;

    }

    // method to create a new organization
    async createOrganization(organizationData) {

        const organization = new Organization(organizationData);

        return await organization.save();

    }

    // method to find an organization by its ID
    async findOrganizationById(organizationId) {

        return await Organization.findById(organizationId).populate("owner", "name email");

    }

    // method to update an organization by its ID

    async updateOrganization(organizationId, updateData) {

        return await Organization.findByIdAndUpdate(organizationId, updateData, { returnDocument: "after" }).populate("owner", "name email");

    }

    // method to delete an organization by its ID

    async deleteOrganization(organizationId) {

        return await Organization.findByIdAndDelete(organizationId);

    }

    // method to find all organizations
    async findAllOrganizations() {

        return await Organization.find().populate("owner", "name email");

    }

    // method to find an organization by its owner
    async findOrganizationByUser(userId) {

        return await Organization.findOne({ owner: userId }).populate("owner", "name email");

    }

}

export default OrganizationDao;