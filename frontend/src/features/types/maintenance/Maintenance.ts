// Estados de mantenimiento según el backend
export type MaintenanceStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Maintenance {
  slug: string;
  courtSlug: string;
  courtName: string;
  createdByUsername: string;
  title: string;
  description: string;
  startTime: string; // ISO date-time
  endTime: string; // ISO date-time
  status: MaintenanceStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceCreatedResponse {
  maintenance: Maintenance;
  cancelledBookingsCount: number;
  message: string;
}
