import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourt } from "../service/court.sp.service";
import { toast } from "sonner";
import type { CreateCourtDTO } from "@/features/types/court/CreateCourtDTO";
import type { Court } from "@/features/types/court/Court";

export const useCreateCourtMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<Court, Error, CreateCourtDTO>({
        mutationFn: createCourt,
        onSuccess: () => {
            toast.success("Pista creada correctamente");
            queryClient.invalidateQueries({ queryKey: ["courts-page"] });
        },
        onError: () => {
            toast.error("Error al crear la pista");
        }
    });
};
