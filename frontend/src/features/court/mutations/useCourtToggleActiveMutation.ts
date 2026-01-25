import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleCourtActive } from "../service/court.sp.service";
import type { Court } from "@/features/types/court/Court";
import type { AxiosError } from "axios";

export const useCourtToggleActiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Court, AxiosError<{ message: string }>, string>({
    mutationFn: (slug: string) => toggleCourtActive(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courts-all"] });
    },
  });
};
