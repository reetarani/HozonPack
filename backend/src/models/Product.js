import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
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
        trim: true
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

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    industries: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Industry",
        }
    ],

    image: {
        type: String,
        default: "",
    },

    isActive: {
        type: Boolean,
        default: true,
    }

}, {
    timestamps: true
});
const Product = mongoose.model("Product", productSchema);

export default Product;