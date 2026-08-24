import api from "./api";

export const getTestimonials = async () => {
    const response = await api.get("/testimonials");

    return response.data.testimonials;
};