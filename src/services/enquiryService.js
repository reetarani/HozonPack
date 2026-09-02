import { api } from "./apiClient";

export const createPublicEnquiry = async (data) => {
    const response = await api.post("/public/enquiry", data);
    return response.data;
};