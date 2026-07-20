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
            currency: String,
            timezone: String,
        },

        logo: String,
        banner: String,
    }

);

// creating organization model
const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;