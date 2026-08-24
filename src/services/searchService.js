import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const searchProducts = async (keyword) => {
    const response = await axios.get(
        `${API_URL}/public/search`,
        {
            params: {
                q: keyword,
            },
        }
    );

    return response.data;
};

export const getSearchSuggestions = async (keyword) => {
    const response = await axios.get(
        `${API_URL}/public/search/suggestions`,
        {
            params: {
                q: keyword,
            },
        }
    );

    return response.data;
};