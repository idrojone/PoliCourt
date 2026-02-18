import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClubStatus } from "../service/club.service";
import type { ClubStatus } from "@/features/types/club/Club";
import { toast } from "sonner";

export const useUpdateClubStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ slug, status }: { slug: string; status: ClubStatus }) =>
            updateClubStatus(slug, status),
        onSuccess: () => {
            toast.success("Estado del club actualizado");
            queryClient.invalidateQueries({ queryKey: ["clubs"] });
        },
        onError: () => {
            toast.error("Error al actualizar el estado del club");
        },
    });
};
