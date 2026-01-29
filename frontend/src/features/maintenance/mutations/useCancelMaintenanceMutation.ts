import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelMaintenance } from "../service/maintenance.sp.service";
import type { AxiosError } from "axios";

export const useCancelMaintenanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<{ message: string }>, string>({
    mutationFn: (slug: string) => cancelMaintenance(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenances"] });
    },
  });
};
