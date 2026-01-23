import type { CreateSportDTO } from "@/features/types/CreateSportDTO";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSport } from "../service/sport.sp.service";

export const useCreateSportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSportDTO) => createSport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports-all"] });
    },
  });
};
