import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClub } from "../service/club.sb.service";
import type { ClubUpdateRequest } from "@/features/types/club/ClubUpdateRequest";
import { toast } from "sonner";

export const useUpdateClubMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ slug, data }: { slug: string; data: ClubUpdateRequest }) =>
            updateClub(slug, data),
        onSuccess: () => {
            toast.success("Club actualizado correctamente");
            queryClient.invalidateQueries({ queryKey: ["clubs"] });
        },
        onError: () => {
            toast.error("Error al actualizar el club");
        },
    });
};
