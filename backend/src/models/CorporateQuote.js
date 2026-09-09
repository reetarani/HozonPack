import mongoose from "mongoose";

const corporateQuoteSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            default: "",
            trim: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        dimensions: {
            type: String,
            default: "",
            trim: true,
        },

        ply: {
            type: String,
            required: true,
            trim: true,
        },

        requirements: {
            type: String,
            default: "",
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

export default mongoose.model(
    "CorporateQuote",
    corporateQuoteSchema
);