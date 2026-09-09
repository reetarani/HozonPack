import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getPublicTopBar = async () => {
    const response = await axios.get(
        `${API_URL}/topbar/public`
    );

    return response.data;
};