import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClub } from "../service/club.service";
import { toast } from "sonner";

export const useDeleteClubMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slug: string) => deleteClub(slug),
        onSuccess: () => {
            toast.success("Club eliminado correctamente");
            queryClient.invalidateQueries({ queryKey: ["clubs"] });
        },
        onError: () => {
            toast.error("Error al eliminar el club");
        },
    });
};
