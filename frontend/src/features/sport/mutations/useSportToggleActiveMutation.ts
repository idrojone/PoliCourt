import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSport, restoreSport } from "../service/sport.sp.service";

export const useSportToggleActiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, isActive }: { slug: string; isActive: boolean }) =>
      isActive ? deleteSport(slug) : restoreSport(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports-page"] });
    },
  });
};
