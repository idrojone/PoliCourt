import axios from "axios";
import qs from "qs";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL_FA || "http://localhost:4003/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: "repeat" });
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.error("Unauthorized");
            }
        }
        return Promise.reject(error);
    },
);
