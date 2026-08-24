import api from "./api";

// Get all search keywords
export const getSearchKeywords = async (params = {}) => {
    const response = await api.get(
        "/search-keywords",
        {
            params,
        }
    );

    return response.data;
};

// Get single search keyword
export const getSearchKeyword = async (id) => {
    const response = await api.get(
        `/search-keywords/id/${id}`
    );

    return response.data;
};

// Delete / deactivate keyword
export const deleteSearchKeyword = async (id) => {
    const response = await api.delete(
        `/search-keywords/id/${id}`
    );

    return response.data;
};

// Permanently delete keyword
export const permanentlyDeleteSearchKeyword =
    async (id) => {
        const response = await api.delete(
            `/search-keywords/id/${id}/permanent`
        );

        return response.data;
    };