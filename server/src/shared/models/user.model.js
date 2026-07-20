// importing modules 
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
    return ;
});

// method to compare the provided password with the hashed password in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// creating user model
const User = mongoose.model("User", userSchema);

// exporting user model
export default User;