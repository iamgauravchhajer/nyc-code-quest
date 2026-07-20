// importing modules 
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKEN_EXPIRES_IN } from "../constants/tokens.constants.js";
import env from "../config/env.config.js";

// defining user schema
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

}, { timestamps: true });

// pre-save hook to hash the password before saving the user
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return;
});

// method to compare the provided password with the hashed password in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// method to give the jwt payload for the user
userSchema.methods.getJWT = function () {
    
    const payload = {
        id: this._id,
        name: this.name,
        email: this.email,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    return token;
}

// creating user model
const User = mongoose.model("User", userSchema);

// exporting user model
export default User;