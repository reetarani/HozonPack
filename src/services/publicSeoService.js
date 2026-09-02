import { api } from "./apiClient";

export const getPublicSeoMeta = async (slug) => {
    const response = await api.get("/public/seo-meta", {
        params: {
            slug,
        },
    });

    return response.data;
};