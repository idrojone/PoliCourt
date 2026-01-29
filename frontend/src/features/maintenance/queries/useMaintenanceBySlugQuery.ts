import { useQuery } from "@tanstack/react-query";
import { getMaintenanceBySlug } from "../service/maintenance.sp.service";

export const useMaintenanceBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: ["maintenances", slug],
    queryFn: () => getMaintenanceBySlug(slug),
    enabled: !!slug,
  });
};
