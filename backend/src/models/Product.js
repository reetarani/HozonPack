import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        // Minimum Order Quantity
        moq: {
            type: Number,
            required: false,
            min: 1,
            default: null,
        },
        moqUnit: {
            type: String,
            enum: ["pcs", "kg"],
            default: "pcs",
        },
        fastDelivery: {
            type: Boolean,
            default: false,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        industries: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Industry",
            },
        ],

        image: {
            type: String,
            default: "",
        },
        gallery: [
            {
                type: String,
            },
        ],

        // Product Highlights
        highlights: [
            {
                icon: {
                    type: String,
                    default: "",
                    trim: true,
                },

                title: {
                    type: String,
                    default: "",
                    trim: true,
                },

                description: {
                    type: String,
                    default: "",
                    trim: true,
                },
            },
        ],

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;