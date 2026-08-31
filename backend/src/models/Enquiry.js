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
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        subject: {
            type: String,
            trim: true,
        },

        // Customer requested quantity
        customMOQ: {
            type: Number,
            default: null,
        },

        message: {
            type: String,
            trim: true,
        },

        // Enquiry status
        status: {
            type: String,
            enum: ["new", "read"],
            default: "new",
        },

        // Soft delete
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