// importing modules
import mongoose from "mongoose";

// defining organization schema
const organizationSchema = new mongoose.Schema(

    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        name: {
            type: String,
            required: true,
        },
        
        type: String,
        
        description: String,

        contact: {
            phone: String,
            email: String,
            website: String,
        },

        address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            country: String,
            pincode: String,
        },

        gstNumber: String,
        fssaiNumber: String,
        panNumber: String,

        settings: {
            tableCount: Number,
            openingTime: String,
            closingTime: String,
        },

        logo: String,
        banner: String,
    }

);

organizationSchema.methods.getJWT = function () {

    const payload = {
        id: this._id,
        name: this.name,
        owner: this.owner,
        type: this.type,
        description: this.description,
        contact: this.contact,
        address: this.address,
        gstNumber: this.gstNumber,
        fssaiNumber: this.fssaiNumber,
        panNumber: this.panNumber,
        settings: this.settings,
        logo: this.logo,
        banner: this.banner,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    return token;

}

// creating organization model
const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;