import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
    {
        badge: {
            type: String,
            trim: true,
            default: "",
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        highlight: {
            type: String,
            trim: true,
            default: "",
        },

        subtitle: {
            type: String,
            trim: true,
            default: "",
        },

        buttonText: {
            type: String,
            trim: true,
            default: "",
        },

        buttonUrl: {
            type: String,
            trim: true,
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

const Hero = mongoose.model("Hero", heroSchema);

export default Hero;