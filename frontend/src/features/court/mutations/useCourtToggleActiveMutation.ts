import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourt, restoreCourt } from "../service/court.sp.service";


export const useCourtToggleActiveMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ slug, isActive }: { slug: string; isActive: boolean }) =>
            isActive ? deleteCourt(slug) : restoreCourt(slug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courts-all"] });
        },
    });
};
