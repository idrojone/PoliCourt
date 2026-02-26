import axios from "axios";
import qs from "qs";
import { setupInterceptors } from "@/lib/interceptors";

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

setupInterceptors(api);
