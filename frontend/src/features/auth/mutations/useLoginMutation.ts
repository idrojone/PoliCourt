import { useMutation } from "@tanstack/react-query";
import { authService } from "../service/auth.sb.service";
import type { LoginRequest, AuthResponse } from "../../types/auth/auth";
import { useAuth } from "../context/AuthContext";

export const useLoginMutation = () => {
    const { login } = useAuth();

    return useMutation<AuthResponse, Error, LoginRequest>({
        mutationFn: (data: LoginRequest) => authService.login(data),
        onSuccess: async (data) => {
            await login(data);
        },
    });
};
