import type { GeneralStatusType } from "@/types";
import type { Sport } from "@/features/types/sport";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { updateSportStatus } from "../service/sport.sp.service";

export const useSportUpdateStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Sport,
    AxiosError<{ message: string }>,
    { slug: string; status: GeneralStatusType }
  >({
    mutationFn: ({
      slug,
      status,
    }: {
      slug: string;
      status: GeneralStatusType;
    }) => updateSportStatus(slug, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports-all"] });
    },
  });
};
