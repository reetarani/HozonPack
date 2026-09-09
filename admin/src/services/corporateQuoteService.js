import api from "./api";


// Get single Corporate Quote
export const getCorporateQuote = async (id) => {
    const response = await api.get(
        `/corporate-quotes/${id}`
    );

    return response.data;
};


// Mark Corporate Quote as Read
export const markCorporateQuoteAsRead = async (id) => {
    const response = await api.patch(
        `/corporate-quotes/${id}/read`
    );

    return response.data;
};


// Soft Delete Corporate Quote
export const deleteCorporateQuote = async (id) => {
    const response = await api.patch(
        `/corporate-quotes/${id}/deactivate`
    );

    return response.data;
};


// Permanent Delete Corporate Quote
export const permanentlyDeleteCorporateQuote = async (id) => {
    const response = await api.delete(
        `/corporate-quotes/${id}/permanent`
    );

    return response.data;
};