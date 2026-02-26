import axios from "axios";
import type { AxiosInstance } from "axios";
import type { AuthResponse } from "@/features/types/auth/auth";
import { setToken, getToken } from "@/lib/token";

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const SB_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

export const setupInterceptors = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error),
    );

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return instance(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const { data } = await axios.post<AuthResponse>(
                        `${SB_BASE_URL}/auth/refresh`,
                        {},
                        { withCredentials: true },
                    );

                    if (data.accessToken) {
                        setToken(data.accessToken);
                        instance.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
                        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                        processQueue(null, data.accessToken);
                        return instance(originalRequest);
                    } else {
                        throw new Error("No token returned");
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);

                    setToken(null);
                    localStorage.removeItem("user");
                    const channel = new BroadcastChannel("auth_channel");
                    channel.postMessage({ type: "LOGOUT" });
                    channel.close();

                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        },
    );
};
