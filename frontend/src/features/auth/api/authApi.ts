import { api } from "@/lib/axios";
import type { LoginUserRequest, LoginUserResponse, RegisterRequest, RegisterResponse } from "../types";

export const registerRequest = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
};

export const loginRequest = async (data: LoginUserRequest): Promise<LoginUserResponse> => {
    const response = await api.post<LoginUserResponse>("/auth/login", data);
    return response.data;
};
