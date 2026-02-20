import { useMutation } from "@tanstack/react-query";
import { authService } from "../service/auth.sb.service";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const useLogoutMutation = () => {
    const { logout } = useAuth();

    return useMutation<void, Error, void>({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            logout();
            toast.success("Sesión cerrada correctamente", {
                description: "Hasta la próxima!"
            });
        },
        onError: () => {
            // Force local logout even if server call fails
            logout();
        }
    });
};
