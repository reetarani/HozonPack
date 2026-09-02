import { api } from "./apiClient";

export const getPublicIndustries = async () => {
    const response = await api.get("/public/industries");
    return response.data;
};