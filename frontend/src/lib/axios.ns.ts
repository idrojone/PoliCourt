import axios from "axios";
import { setupInterceptors } from "@/lib/interceptors";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_NS || "http://localhost:4002",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

setupInterceptors(api);

export default api;
