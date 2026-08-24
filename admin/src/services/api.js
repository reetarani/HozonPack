import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Add JWT automatically
api.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired JWT
api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (
            error.response?.status === 401 &&
            !error.config?.url?.includes("/auth/login")
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;