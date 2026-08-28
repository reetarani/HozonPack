import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getPublicIndustries = async () => {
    const response = await axios.get(
        `${API_URL}/public/industries`
    );

    return response.data;
};