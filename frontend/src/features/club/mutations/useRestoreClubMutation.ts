import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreClub } from "../service/club.sb.service";
import { toast } from "sonner";

export const useRestoreClubMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slug: string) => restoreClub(slug),
        onSuccess: () => {
            toast.success("Club restaurado correctamente");
            queryClient.invalidateQueries({ queryKey: ["clubs"] });
        },
        onError: () => {
            toast.error("Error al restaurar el club");
        },
    });
};
