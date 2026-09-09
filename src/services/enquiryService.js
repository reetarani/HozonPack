import axios from "axios";

const API_URL = "http://localhost:5000/api";

/*
|--------------------------------------------------------------------------
| Public Enquiry
|--------------------------------------------------------------------------
*/

export const createPublicEnquiry = async (data) => {
    const response = await axios.post(
        `${API_URL}/public/enquiry`,
        data
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Admin - Combined Enquiries
| Product Enquiries + Corporate Quotes
|--------------------------------------------------------------------------
*/

export const getAllEnquiries = async (params = {}) => {
    const response = await axios.get(
        `${API_URL}/enquiries/all`,
        {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "token"
                )}`,
            },
        }
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| Admin - Product Enquiry
|--------------------------------------------------------------------------
*/

export const getEnquiries = async (params = {}) => {
    const response = await axios.get(
        `${API_URL}/enquiries`,
        {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "token"
                )}`,
            },
        }
    );

    return response.data;
};

export const getEnquiry = async (id) => {
    const response = await axios.get(
        `${API_URL}/enquiries/id/${id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "token"
                )}`,
            },
        }
    );

    return response.data;
};

export const markEnquiryAsRead = async (id) => {
    const response = await axios.put(
        `${API_URL}/enquiries/id/${id}/read`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "token"
                )}`,
            },
        }
    );

    return response.data;
};

export const deleteEnquiry = async (id) => {
    const response = await axios.delete(
        `${API_URL}/enquiries/id/${id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "token"
                )}`,
            },
        }
    );

    return response.data;
};

export const permanentlyDeleteEnquiry = async (id) => {
    const response = await axios.delete(
        `${API_URL}/enquiries/id/${id}/permanent`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(
                    "token"
                )}`,
            },
        }
    );

    return response.data;
};