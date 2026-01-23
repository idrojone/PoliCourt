import type { GeneralStatus } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSportStatus } from "../service/sport.sp.service";

export const useUpdateSportStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      status,
    }: {
      slug: string;
      status: typeof GeneralStatus;
    }) => updateSportStatus(slug, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sports-all"] });
  });
};
