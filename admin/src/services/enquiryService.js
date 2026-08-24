import api from "./api";

// Get all enquiries
export const getEnquiries = async (params = {}) => {
    const response = await api.get("/enquiries", {
        params,
    });

    return response.data;
};

// Get single enquiry
export const getEnquiry = async (id) => {
    const response = await api.get(
        `/enquiries/id/${id}`
    );

    return response.data;
};

// Create enquiry
export const createEnquiry = async (data) => {
    const response = await api.post(
        "/enquiries",
        data
    );

    return response.data;
};
export const markEnquiryAsRead = async (id) => {
    const response = await api.put(
        `/enquiries/id/${id}/read`
    );

    return response.data;
};
export const deleteEnquiry = async (id) => {
    const response = await api.delete(
        `/enquiries/id/${id}`
    );

    return response.data;
};
export const permanentlyDeleteEnquiry = async (id) => {
    const response = await api.delete(
        `/enquiries/id/${id}/permanent`
    );

    return response.data;
};