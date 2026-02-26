import axios from "axios";
import { setupInterceptors } from "@/lib/interceptors";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_SB || "http://localhost:4001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

setupInterceptors(api);
