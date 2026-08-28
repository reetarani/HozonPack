import mongoose from "mongoose";

const industrySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        subtitle: {
            type: String,
            default: "",
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        image: {
            type: String,
            default: "",
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

const Industry = mongoose.model(
    "Industry",
    industrySchema
);

export default Industry;