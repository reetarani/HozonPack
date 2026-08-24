import mongoose from "mongoose";

const seoMetaSchema = new mongoose.Schema(
    {
        page: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            trim: true,
        },

        metaTitle: {
            type: String,
            trim: true,
            maxlength: 60,
        },

        metaKeywords: {
            type: String,
            trim: true,
        },

        metaDescription: {
            type: String,
            trim: true,
            maxlength: 160,
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

const SeoMeta = mongoose.model(
    "SeoMeta",
    seoMetaSchema
);

export default SeoMeta;