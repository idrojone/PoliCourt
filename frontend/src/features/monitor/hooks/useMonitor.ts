import { useMemo } from "react";
import { useMonitorApplicationsQuery } from "@/features/monitor/queries/useMonitorApplicationsQuery";
import { useChangeMonitorStatusMutation } from "@/features/monitor/mutations/useChangeMonitorStatusMutation";
import type { MonitorApplication } from "@/features/monitor/service/monitor.service";

export const useMonitor = (filteredStatus: "all" | "pending" | "approved" | "rejected") => {
  const query = useMonitorApplicationsQuery(filteredStatus);
  const mutation = useChangeMonitorStatusMutation();

  const applications = (query.data?.items as MonitorApplication[]) || [];
  const totalCount = query.data?.total ?? null;

  const changeStatus = async (uuid: string, status: "approved" | "rejected") => {
    await mutation.mutateAsync({ uuid, status });
  };

  return useMemo(
    () => ({
      applications,
      isLoading: query.isLoading,
      error: query.error ? (query.error as Error).message : null,
      totalCount,
      fetchApplications: query.refetch,
      changeStatus,
    }),
    [applications, query.isLoading, query.error, totalCount, query.refetch]
  );
};

export type { MonitorApplication } from "@/features/monitor/service/monitor.service";

