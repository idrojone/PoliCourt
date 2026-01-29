import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMaintenanceStatus } from "../service/maintenance.sp.service";
import type { Maintenance, MaintenanceStatus } from "@/features/types/maintenance";
import type { AxiosError } from "axios";

interface UpdateStatusParams {
  slug: string;
  status: MaintenanceStatus;
}

export const useUpdateMaintenanceStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Maintenance, AxiosError<{ message: string }>, UpdateStatusParams>({
    mutationFn: ({ slug, status }) => updateMaintenanceStatus(slug, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenances"] });
    },
  });
};
