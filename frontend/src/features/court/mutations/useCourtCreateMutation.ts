import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createCourt } from "../service/court.sp.service";
import type { Court } from "@/features/types/court/Court";
import type { CreateCourtDTO } from "@/features/types/court/CreateCourtDTO";

export const useCreateCourtMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Court, AxiosError<{ message: string }>, CreateCourtDTO>({
    mutationFn: (payload: CreateCourtDTO) => createCourt(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courts-all"] });
    },
  });
};
