import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const useLogoutMutation = () => {
    const { logout } = useAuth();

    return useMutation<void, Error, void>({
        mutationFn: () => logout(),
        onSuccess: () => {
            toast.success("Sesión cerrada correctamente", {
                description: "Hasta la próxima!"
            });
        },
    });
};
