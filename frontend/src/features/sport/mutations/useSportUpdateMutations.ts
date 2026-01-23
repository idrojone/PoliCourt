import type { CreateSportDTO } from "@/features/types/CreateSportDTO";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSport } from "../service/sport.sp.service";

export const useSportUpdateMutations = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string;
      payload: Partial<CreateSportDTO>;
    }) => updateSport(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports-all"] });
    },
  });
};
