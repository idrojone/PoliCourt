import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClub, restoreClub } from "../service/club.service";
import { toast } from "sonner";

export const useClubToggleActiveMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ slug, isActive }: { slug: string; isActive: boolean }) =>
            isActive ? deleteClub(slug) : restoreClub(slug),
        onSuccess: (_, { isActive }) => {
            toast.success(isActive ? "Club desactivado" : "Club activado");
            queryClient.invalidateQueries({ queryKey: ["clubs"] });
        },
        onError: () => {
            toast.error("Error al cambiar el estado del club");
        },
    });
};
