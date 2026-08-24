import api from "./api";

export const getHeroes = async () => {
    const response = await api.get("/heroes");
    return response.data;
};

export const getHero = async (id) => {
    const response = await api.get(`/heroes/${id}`);
    return response.data;
};

export const createHero = async (formData) => {
    const response = await api.post(
        "/heroes",
        formData
    );

    return response.data;
};

export const updateHero = async (id, formData) => {
    const response = await api.put(
        `/heroes/${id}`,
        formData
    );

    return response.data;
};

export const deleteHero = async (id) => {
    const response = await api.delete(
        `/heroes/${id}`
    );

    return response.data;
};

export const getPublicHero = async () => {
    const response = await api.get("/public/hero");

    return response.data;
};