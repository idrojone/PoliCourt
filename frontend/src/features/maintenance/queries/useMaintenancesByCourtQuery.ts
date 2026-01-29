import { useQuery } from "@tanstack/react-query";
import { getMaintenancesByCourtSlug } from "../service/maintenance.sp.service";

export const useMaintenancesByCourtQuery = (courtSlug: string) => {
  return useQuery({
    queryKey: ["maintenances", "court", courtSlug],
    queryFn: () => getMaintenancesByCourtSlug(courtSlug),
    enabled: !!courtSlug,
  });
};
