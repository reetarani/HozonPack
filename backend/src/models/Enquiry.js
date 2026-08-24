import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        companyLocation: {
            type: String,
            required: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        subject: {
            type: String,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["new", "read"],
            default: "new",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Enquiry = mongoose.model(
    "Enquiry",
    enquirySchema
);

export default Enquiry;