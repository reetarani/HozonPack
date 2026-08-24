import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getPublicProducts = async () => {
    const response = await axios.get(
        `${API_URL}/public/products`
    );

    return response.data;
};