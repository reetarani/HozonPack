import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getPublicClients = async () => {
    const response = await axios.get(
        `${API_URL}/public/clients`
    );

    return response.data;
};