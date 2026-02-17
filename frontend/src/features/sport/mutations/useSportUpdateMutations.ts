import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { updateSport } from "../service/sport.sp.service";
import type { Sport } from "@/features/types/sport/Sport";
import type { CreateSportDTO } from "@/features/types/sport/CreateSportDTO";

export const useSportUpdateMutations = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Sport,
    AxiosError<{ message: string }>,
    { slug: string; payload: Partial<CreateSportDTO> }
  >({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string;
      payload: Partial<CreateSportDTO>;
    }) => updateSport(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports-page"] });
    },
  });
};
