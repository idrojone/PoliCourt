import type { GeneralStatusType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { updateCourtStatus } from "../service/court.sp.service";
import type { Court } from "@/features/types/court/Court";
import { toast } from "sonner";

export const useCourtUpdateStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Court,
        AxiosError<{ message: string }>,
        { slug: string; status: GeneralStatusType }
    >({
        mutationFn: ({
            slug,
            status,
        }: {
            slug: string;
            status: GeneralStatusType;
        }) => updateCourtStatus(slug, status),
        onSuccess: () => {
            toast.success("Estado actualizado");
            queryClient.invalidateQueries({ queryKey: ["courts-page"] });
        },
        onError: () => {
            toast.error("Error al actualizar el estado");
        }
    });
};
