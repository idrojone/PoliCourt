import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMaintenance } from "../service/maintenance.sp.service";
import type { AxiosError } from "axios";

export const useDeleteMaintenanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<{ message: string }>, string>({
    mutationFn: (slug: string) => deleteMaintenance(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenances"] });
    },
  });
};
