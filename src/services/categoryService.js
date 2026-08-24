import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getPublicCategories = async () => {
    const response = await axios.get(
        `${API_URL}/public/categories`
    );

    return response.data;
};