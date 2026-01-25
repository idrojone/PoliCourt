import type { GeneralStatusType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourtStatus } from "../service/court.sp.service";
import type { Court } from "@/features/types/court/Court";
import type { AxiosError } from "axios";

export const useCourtUpdateStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Court,
    AxiosError<{ message: string }>,
    { slug: string; status: GeneralStatusType }
  >({
    mutationFn: ({
      slug,
      status,
    }: {
      slug: string;
      status: GeneralStatusType;
    }) => updateCourtStatus(slug, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courts-all"] });
    },
  });
};
