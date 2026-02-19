import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClub } from "../service/club.sb.service";
import type { ClubCreateRequest } from "@/features/types/club/ClubCreateRequest";
import { toast } from "sonner";

export const useCreateClubMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ClubCreateRequest) => createClub(data),
        onSuccess: () => {
            toast.success("Club creado correctamente");
            queryClient.invalidateQueries({ queryKey: ["clubs"] });
        },
        onError: () => {
            toast.error("Error al crear el club");
        },
    });
};
