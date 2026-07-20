// import modules
import UserDao from "../../shared/dao/user.dao.js";
import ApiError from "../../shared/utils/ApiError.util.js";
import ApiResponse from "../../shared/utils/ApiResponse.util.js";
import { COOKIE_CONFIG, ORG_COOKIE_CONFIG } from "../../shared/constants/tokens.constants.js";
import sanitizeUser from "../../shared/utils/user.sanitizer.js";
import OrganizationDao from "../../shared/dao/organization.dao.js"; 
import env from "../../shared/config/env.config.js";


// class to handle authentication operations
class AuthController {

    // constructor to initialize the AuthController class
    constructor() {

        // creating an instance of UserDao to handle user data access operations
        this.userDao = new UserDao();

        // creating an instance of OrganizationDao to handle organization data access operations
        this.organizationDao = new OrganizationDao();

    }

    // method to handle user registration
    signup = async (req, res) => {

        const { name, email, password } = req.body;

        // check if user already exists
        const existingUser = await this.userDao.findUserByEmail(email);

        if (existingUser) {
            throw new ApiError(409, "User already exists");
        }

        // create new user
        const newUser = await this.userDao.createUser({ name, email, password });

        // get the JWT 
        const jwt = newUser.getJWT();

        res.cookie("token", jwt, COOKIE_CONFIG);

        return ApiResponse(res, 201, "User registered successfully", { user: sanitizeUser(newUser) });
    }

    // method to handle user login
    login = async (req, res) => {

        const { email, password } = req.body;

        // find user by email
        const user = await this.userDao.findUserByEmail(email);

        if (!user) {
            throw new ApiError(401, "Invalid email or password");
        }

        // compare provided password with hashed password in the database
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid email or password");
        }

        // get the JWT 
        const jwt = user.getJWT();

        res.cookie("token", jwt, COOKIE_CONFIG);

        // find the organization associated with the user
        const organization = await this.organizationDao.findOrganizationByUser(user._id);

        if (organization) {
            const orgJwt = organization.getJWT();
            res.cookie("organization", orgJwt, ORG_COOKIE_CONFIG);
        }


        return ApiResponse(res, 200, "User logged in successfully", { user: sanitizeUser(user) });

    }

    // method to get current logged in user details
    getMe = async (req, res) => {
        const user = await this.userDao.findUserByEmail(req.user.email);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return ApiResponse(res, 200, "User fetched successfully", { user: sanitizeUser(user) });
    }

    // method to handle user logout
    logout = async (req, res) => {
        res.clearCookie("token", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax"
        });
        res.clearCookie("organization", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "lax"
        });
        return ApiResponse(res, 200, "User logged out successfully");
    }

}

export default AuthController;