import { api } from "./apiClient";

export const getPublicClients = async () => {
    const response = await api.get("/public/clients");
    return response.data;
};