import { api } from "./apiClient";

export const getPublicCategories = async () => {
    const response = await api.get("/public/categories");
    return response.data;
};