import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const useLogoutAllMutation = () => {
    const { logoutAll } = useAuth();

    return useMutation<void, Error, void>({
        mutationFn: () => logoutAll(),
        onSuccess: () => {
            toast.success("Sesión cerrada en todos los dispositivos", {
                description: "Has cerrado sesión en todas partes, vuelve a iniciar sesión si lo deseas."
            });
        },
    });
};
