import { useMutation } from "@tanstack/react-query";
import { authService } from "../service/auth.sb.service";
import type { RegisterRequest } from "../../types/auth/auth";

export const useRegisterMutation = () => {
    return useMutation<string, Error, RegisterRequest>({
        mutationFn: (data: RegisterRequest) => authService.register(data),
    });
};
