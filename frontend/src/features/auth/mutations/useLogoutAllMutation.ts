import { useMutation } from "@tanstack/react-query";
import { authService } from "../service/auth.sb.service";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const useLogoutAllMutation = () => {
    const { logout } = useAuth();

    return useMutation<void, Error, void>({
        mutationFn: () => authService.logoutAll(),
        onSuccess: () => {
            // clear local auth state after server invalidates tokens
            logout();
            toast.success("Sesión cerrada en todos los dispositivos", {
                description: "Has cerrado sesión en todas partes, vuelve a iniciar sesión si lo deseas."
            });
        },
        onError: () => {
            // even if call fails we force logout locally
            logout();
        }
    });
};
