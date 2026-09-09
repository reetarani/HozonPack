import mongoose from "mongoose";

const topBarSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        couponCode: {
            type: String,
            trim: true,
            default: "",
        },

        endDate: {
            type: Date,
            required: true,
        },

        linkText: {
            type: String,
            trim: true,
            default: "Shop now",
        },

        linkUrl: {
            type: String,
            trim: true,
            default: "/",
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

export default mongoose.model("TopBar", topBarSchema);