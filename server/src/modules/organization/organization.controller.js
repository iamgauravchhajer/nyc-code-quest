// importing modules
import ApiError from "../../shared/utils/ApiError.util.js";
import ApiResponse from "../../shared/utils/ApiResponse.util.js";
import OrganizationDao from "../../shared/dao/organization.dao.js";
import { ORG_COOKIE_CONFIG } from "../../shared/constants/tokens.constants.js";

// class for organization controller
class OrganizationController {

    constructor() {

        // creating an instance of OrganizationDao
        this.organizationDao = new OrganizationDao();

    }

    createOrganization = async (req, res) => {

        const { name, description, phone, website, address, openingTime, closingTime, gstNumber, fssaiNumber, panNumber, logo, banner } = req.body;

        // check if organization already exists
        const existingOrganization = await this.organizationService.findOrganizationByUser(req.user.id);

        if (existingOrganization) {

            throw new ApiError(409, "Organization already exists");

        }

        // create new organization
        const newOrganization = await this.organizationService.createOrganization({
            owner: req.user.id,
            name,
            description,
            contact: {
                phone,
                email: req.user.email,
                website,
            },
            address,
            settings: {
                openingTime,
                closingTime,
            },
            gstNumber,
            fssaiNumber,
            panNumber,
            logo,
            banner,
        });

        const jwt = newOrganization.getJWT();

        res.cookie("organization", jwt, ORG_COOKIE_CONFIG);

        return ApiResponse(res, 201, "Organization created successfully", { organization: newOrganization });

    }

    // method to get organization details
    getOrganizationDetails = async (req, res) => {

        const organization = await this.organizationService.findOrganizationByUser(req.user.id);

        if (!organization) {

            throw new ApiError(404, "Organization not found");

        }

        return ApiResponse(res, 200, "Organization details fetched successfully", { organization });

    }

    // method to update organization details
    updateOrganizationDetails = async (req, res) => {

        const { name, description, phone, website, address, openingTime, closingTime, gstNumber, fssaiNumber, panNumber, logo, banner } = req.body;

        const organization = await this.organizationService.findOrganizationByUser(req.user.id);

        if (!organization) {

            throw new ApiError(404, "Organization not found");

        }

        const updatedOrganization = await this.organizationService.updateOrganization(organization._id, {
            name,
            description,
            contact: {
                phone,
                email: req.user.email,
                website,
            },
            address,
            settings: {
                openingTime,
                closingTime,
            },
            gstNumber,
            fssaiNumber,
            panNumber,
            logo,
            banner,
        });

        return ApiResponse(res, 200, "Organization details updated successfully", { organization: updatedOrganization });

    }

    // method to delete organization
    deleteOrganization = async (req, res) => {

        const organization = await this.organizationService.findOrganizationByUser(req.user.id);

        if (!organization) {

            throw new ApiError(404, "Organization not found");

        }

        await this.organizationService.deleteOrganization(organization._id);

        return ApiResponse(res, 200, "Organization deleted successfully");

    }

}


export default OrganizationController;