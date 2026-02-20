import { api } from "@/lib/axios.sb";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../../types/auth/auth";

export const authService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/login", data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<string> => {
        const response = await api.post<string>("/auth/register", data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post("/auth/logout");
    },

    logoutAll: async (): Promise<void> => {
        await api.post("/auth/logout-all");
    },
};
