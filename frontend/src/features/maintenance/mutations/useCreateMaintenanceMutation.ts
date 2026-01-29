import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMaintenance } from "../service/maintenance.sp.service";
import type { CreateMaintenanceDTO, MaintenanceCreatedResponse } from "@/features/types/maintenance";
import type { AxiosError } from "axios";

export const useCreateMaintenanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<MaintenanceCreatedResponse, AxiosError<{ message: string }>, CreateMaintenanceDTO>({
    mutationFn: (payload: CreateMaintenanceDTO) => createMaintenance(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenances"] });
      // También invalidar bookings por si se cancelaron reservas
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
