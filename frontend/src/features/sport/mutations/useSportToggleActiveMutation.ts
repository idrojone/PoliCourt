import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSportActive } from "../service/sport.sp.service";

export const useSportToggleActiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => toggleSportActive(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports-all"] });
    },
  });
};
