import type { MaintenanceStatus } from "./Maintenance";

export interface CreateMaintenanceDTO {
  courtSlug: string;
  createdByUsername: string;
  title: string;
  description?: string;
  startTime: string; // ISO date-time
  endTime: string; // ISO date-time
  status?: MaintenanceStatus;
}
