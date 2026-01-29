import { useQuery } from "@tanstack/react-query";
import { getMaintenancesByStatus } from "../service/maintenance.sp.service";
import type { MaintenanceStatus } from "@/features/types/maintenance";

export const useMaintenancesByStatusQuery = (status: MaintenanceStatus) => {
  return useQuery({
    queryKey: ["maintenances", "status", status],
    queryFn: () => getMaintenancesByStatus(status),
    enabled: !!status,
  });
};
