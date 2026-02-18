import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { updateCourt } from "../service/court.sp.service";
import type { UpdateCourtDTO } from "@/features/types/court/UpdateCourtDTO";
import type { Court } from "@/features/types/court/Court";

export const useUpdateCourtMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<
        Court,
        AxiosError<{ message: string }>,
        { slug: string; payload: UpdateCourtDTO }
    >({
        mutationFn: ({
            slug,
            payload,
        }: {
            slug: string;
            payload: UpdateCourtDTO;
        }) => updateCourt(slug, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courts-page"] });
        },
    });
};
