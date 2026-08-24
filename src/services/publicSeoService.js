import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getPublicSeoMeta = async (slug) => {
    const response = await axios.get(
        `${API_URL}/public/seo-meta`,
        {
            params: {
                slug,
            },
        }
    );

    return response.data;
};