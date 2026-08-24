import api from "./api";

export const getIndustries = async () => {
    const response = await api.get("/industries");

    return response.data.industries;
};

export const getIndustry = async (id) => {
    const response = await api.get(`/industries/id/${id}`);

    return response.data;
};

export const createIndustry = async (data) => {
    const response = await api.post("/industries", data);

    return response.data;
};

export const updateIndustry = async (id, data) => {
    const response = await api.put(
        `/industries/id/${id}`,
        data
    );

    return response.data;
};

export const deleteIndustry = async (id) => {
    const response = await api.delete(
        `/industries/id/${id}`
    );

    return response.data;
};
export const permanentlyDeleteIndustry = async (id) => {
    const response = await api.delete(
        `/industries/id/${id}/permanent`
    );

    return response.data;
};