import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        logo: {
            type: String,
            default: null,
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

const Client = mongoose.model("Client", clientSchema);

export default Client;