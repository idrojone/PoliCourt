import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMaintenance } from "../service/maintenance.sp.service";
import type { UpdateMaintenanceDTO, MaintenanceCreatedResponse } from "@/features/types/maintenance";
import type { AxiosError } from "axios";

interface UpdateMaintenanceParams {
  slug: string;
  payload: UpdateMaintenanceDTO;
}

export const useUpdateMaintenanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<MaintenanceCreatedResponse, AxiosError<{ message: string }>, UpdateMaintenanceParams>({
    mutationFn: ({ slug, payload }) => updateMaintenance(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenances"] });
    },
  });
};
