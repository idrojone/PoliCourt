import { useQuery } from "@tanstack/react-query";
import { fetchApplications, type ApplicationsPayload } from "@/features/monitor/service/monitor.service";

export const useMonitorApplicationsQuery = (status: "all" | "pending" | "approved" | "rejected") => {
  return useQuery<ApplicationsPayload, Error>({
    queryKey: ["monitor-applications", status],
    queryFn: () => fetchApplications(status),
    staleTime: 1000 * 60,
    retry: 1,
  });
};

export default useMonitorApplicationsQuery;
