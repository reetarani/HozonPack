import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getPublicTestimonials = async () => {
    const response = await axios.get(
        `${API_URL}/public/testimonials`
    );

    return response.data;
};