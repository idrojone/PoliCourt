import axios from "axios";
import type { AuthResponse } from "@/features/types/auth/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_SB || "http://localhost:4001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let inMemoryToken: string | null = null;

export const setToken = (token: string | null) => {
  inMemoryToken = token;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getToken = () => {
  return inMemoryToken || localStorage.getItem("token");
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
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
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<AuthResponse>(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (data.accessToken) {
          setToken(data.accessToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

          processQueue(null, data.accessToken);
          return api(originalRequest);
        } else {
          throw new Error("No token returned");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        setToken(null);
        localStorage.removeItem("user");
        const channel = new BroadcastChannel('auth_channel');
        channel.postMessage({ type: 'LOGOUT' });
        channel.close();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
