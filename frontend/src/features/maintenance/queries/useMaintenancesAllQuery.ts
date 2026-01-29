import { useQuery } from "@tanstack/react-query";
import { getAllMaintenances } from "../service/maintenance.sp.service";

export const useMaintenancesAllQuery = () => {
  return useQuery({
    queryKey: ["maintenances"],
    queryFn: () => getAllMaintenances(),
  });
};
