import api from "./api";

// Get all SEO meta
export const getSeoMeta = async (params = {}) => {
    const response = await api.get("/seo-meta", {
        params,
    });

    return response.data;
};

// Get single SEO meta
export const getSeoMetaById = async (id) => {
    const response = await api.get(
        `/seo-meta/id/${id}`
    );

    return response.data;
};

// Create SEO meta
export const createSeoMeta = async (data) => {
    const response = await api.post(
        "/seo-meta",
        data
    );

    return response.data;
};

// Update SEO meta
export const updateSeoMeta = async (
    id,
    data
) => {
    const response = await api.put(
        `/seo-meta/id/${id}`,
        data
    );

    return response.data;
};

// Soft delete
export const deleteSeoMeta = async (id) => {
    const response = await api.delete(
        `/seo-meta/id/${id}`
    );

    return response.data;
};

// Permanent delete
export const permanentlyDeleteSeoMeta =
    async (id) => {
        const response = await api.delete(
            `/seo-meta/id/${id}/permanent`
        );

        return response.data;
    };