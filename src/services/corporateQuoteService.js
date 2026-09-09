import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const createCorporateQuote = async (data) => {
    const response = await axios.post(
        `${API_URL}/corporate-quotes`,
        data
    );

    return response.data;
};