import type { CreateSportDTO } from "@/features/types/CreateSportDTO";
import type { Sport } from "@/features/types/sport";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createSport } from "../service/sport.sp.service";

export const useCreateSportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Sport, AxiosError<{ message: string }>, CreateSportDTO>({
    mutationFn: (payload: CreateSportDTO) => createSport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports-all"] });
    },
  });
};
