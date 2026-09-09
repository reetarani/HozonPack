import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getPublicProducts = async () => {
    const response = await axios.get(
        `${API_URL}/public/products`
    );

    return response.data;
};
// Get single public product by slug
export const getProductBySlug = async (slug) => {
    const response = await axios.get(
        `${API_URL}/products/slug/${slug}`
    );

    return response.data;
};