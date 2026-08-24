import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const createPublicEnquiry = async (data) => {
    const response = await axios.post(
        `${API_URL}/public/enquiry`,
        data
    );

    return response.data;
};