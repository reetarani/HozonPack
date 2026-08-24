import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
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

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;