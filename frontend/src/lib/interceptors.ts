import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import type { AuthResponse } from "@/features/types/auth/auth";
import { setToken, getToken } from "@/lib/token";

interface ExtendedRequestConfig extends AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    _retry?: boolean;
    headers?: Record<string, any>;
}

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

const clearAuthSession = (error: unknown) => {
    setToken(null);
    localStorage.removeItem("auth_tokens");
    const channel = new BroadcastChannel("auth_channel");
    channel.postMessage({ type: "LOGOUT" });
    channel.close();
    return Promise.reject(error);
};

export const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const { data } = await axios.post<AuthResponse>(
            `${SB_BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true },
        );

        if (!data.accessToken) {
            return null;
        }

        setToken(data.accessToken);
        return data.accessToken;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("[auth] /auth/refresh failed", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
        } else {
            console.error("[auth] /auth/refresh failed", error);
        }

        throw error;
    }
};

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
            const originalRequest = error.config as ExtendedRequestConfig;

            if (originalRequest?.skipAuthRefresh) {
                if (error.response?.status === 401) {
                    return clearAuthSession(error);
                }
                return Promise.reject(error);
            }

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            if (!originalRequest.headers) originalRequest.headers = {};
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return instance(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const accessToken = await refreshAccessToken();

                    if (accessToken) {
                        instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                        if (!originalRequest.headers) originalRequest.headers = {};
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                        processQueue(null, accessToken);
                        return instance(originalRequest);
                    } else {
                        throw new Error("No token returned");
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    return clearAuthSession(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        },
    );
};
