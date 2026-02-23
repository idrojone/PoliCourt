import { api } from "@/lib/axios.sb";
import type { AuthResponse, AuthMeResponse, LoginRequest, RegisterRequest } from "../../types/auth/auth";

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        return await api.post("/auth/login", data).then((res) => res.data.data);
    },

    register: async (data: RegisterRequest): Promise<string> => {
        return await api.post("/auth/register", data).then((res) => res.data.data);
    },

    me: async (): Promise<AuthMeResponse> => {
        return await api.get("/auth/me").then((res) => res.data.data);
    },

    logout: async (): Promise<void> => {
        await api.post("/auth/logout");
    },

    logoutAll: async (): Promise<void> => {
        await api.post("/auth/logout-all");
    },
};
