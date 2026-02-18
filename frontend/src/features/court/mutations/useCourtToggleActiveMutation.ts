import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourt, restoreCourt } from "../service/court.sp.service";
import { toast } from "sonner";

export const useCourtToggleActiveMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ slug, isActive }: { slug: string; isActive: boolean }) =>
            isActive ? deleteCourt(slug) : restoreCourt(slug),
        onSuccess: (_, { isActive }) => {
            toast.success(isActive ? "Pista desactivada" : "Pista activada");
            queryClient.invalidateQueries({ queryKey: ["courts-page"] });
        },
        onError: () => {
            toast.error("Error al cambiar el estado de la pista");
        }
    });
};
