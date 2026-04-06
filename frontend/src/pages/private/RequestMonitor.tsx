import { useState } from "react";
import { DashboardLayout } from "@/layout/dashboard";
import { useMonitor } from "@/features/monitor/hooks/useMonitor";
import { MonitorFilter, MonitorTable } from "@/features/monitor/components";


export const RequestMonitorDashboard = () => {
  const [filteredStatus, setFilteredStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const { applications, isLoading, error, totalCount, fetchApplications, changeStatus } = useMonitor(filteredStatus);

  return (
    <DashboardLayout title="Solicitudes de monitores" actionLabel="Refrescar" onAction={fetchApplications}>
      <MonitorFilter value={filteredStatus} onChange={setFilteredStatus} />

      {isLoading ? (
        <div className="p-6">Cargando solicitudes...</div>
      ) : error ? (
        <div className="p-6 text-red-500">{error}</div>
      ) : applications.length === 0 ? (
        <div className="p-6">No hay solicitudes por el momento.</div>
      ) : (
        <MonitorTable applications={applications} totalCount={totalCount} onChangeStatus={changeStatus} />
      )}
    </DashboardLayout>
  );
};