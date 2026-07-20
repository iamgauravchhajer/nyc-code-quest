// importing modules
import User from "../models/user.model.js";

// class to handle user data access operations
class UserDao {

    // constructor to initialize the UserDao class
    constructor() {

        this.User = User;

    }

    // method to create a new user
    async createUser(userData) {

        const user = new this.User.create(userData);

        return user;

    }

    // method to find a user by email
    async findUserByEmail(email) {

        const user = await this.User.findOne({ email });

        return user;

    }

    // method to find a user by id
    async findUserById(id) {

        const user = await this.User.findById(id);

        return user;
    }

    // method to update a user by id
    async updateUserById(id, updateData) {

        const user = await this.User.findByIdAndUpdate(id, updateData, { returnDocument: "after" });

        return user;
    }
}

export default UserDao;