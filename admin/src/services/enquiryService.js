import axios from "axios";
import api from "./api";

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
|--------------------------------------------------------------------------
*/

export const getAllEnquiries = async (params = {}) => {
    const response = await api.get(
        "/enquiries/all",
        {
            params,
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
    const response = await api.get(
        "/enquiries",
        {
            params,
        }
    );

    return response.data;
};


export const getEnquiry = async (id) => {
    const response = await api.get(
        `/enquiries/id/${id}`
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