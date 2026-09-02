import { api } from "./apiClient";

export const getPublicTestimonials = async () => {
    const response = await api.get("/public/testimonials");
    return response.data;
};