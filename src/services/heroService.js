import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Admin APIs

export const getHeroes = async () => {
    const response = await axios.get(
        `${API_URL}/heroes`
    );

    return response.data;
};

export const getHero = async (id) => {
    const response = await axios.get(
        `${API_URL}/heroes/${id}`
    );

    return response.data;
};

export const createHero = async (formData) => {
    const response = await axios.post(
        `${API_URL}/heroes`,
        formData
    );

    return response.data;
};

export const updateHero = async (id, formData) => {
    const response = await axios.put(
        `${API_URL}/heroes/${id}`,
        formData
    );

    return response.data;
};

export const deleteHero = async (id) => {
    const response = await axios.delete(
        `${API_URL}/heroes/${id}`
    );

    return response.data;
};


// Public Hero API

export const getPublicHero = async () => {
    const response = await axios.get(
        `${API_URL}/public/hero`
    );

    return response.data;
};