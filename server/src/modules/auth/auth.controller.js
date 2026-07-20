// import modules
import UserDao from "../../shared/dao/user.dao.js";
import ApiError from "../../shared/utils/ApiError.util.js";
import ApiResponse from "../../shared/utils/ApiResponse.util.js";
import { COOKIE_CONFIG } from "../../shared/constants/tokens.constants.js";
import sanitizeUser from "../../shared/utils/user.sanitizer.js";

// class to handle authentication operations
class AuthController {

    // constructor to initialize the AuthController class
    constructor() {

        // creating an instance of UserDao to handle user data access operations
        this.userDao = new UserDao();

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

        return ApiResponse(res, 200, "User logged in successfully", { user: sanitizeUser(user) });

    }

}

export default AuthController;