import mongoose from "mongoose";

const searchKeywordSchema = new mongoose.Schema(
    {
        keyword: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        count: {
            type: Number,
            default: 1,
        },

        lastSearchedAt: {
            type: Date,
            default: Date.now,
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

searchKeywordSchema.index(
    { keyword: 1 },
    { unique: true }
);

const SearchKeyword = mongoose.model(
    "SearchKeyword",
    searchKeywordSchema
);

export default SearchKeyword;