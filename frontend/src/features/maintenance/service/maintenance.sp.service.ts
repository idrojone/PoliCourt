import { api } from "@/lib/axios.sb";
import type {
  Maintenance,
  MaintenanceCreatedResponse,
  MaintenanceStatus,
  CreateMaintenanceDTO,
} from "@/features/types/maintenance";

// ========================
// GET endpoints
// ========================

export const getAllMaintenances = async (): Promise<Maintenance[]> => {
  return await api.get("/maintenances").then((res) => res.data.data);
};

export const getMaintenanceBySlug = async (slug: string): Promise<Maintenance> => {
  return await api.get(`/maintenances/${slug}`).then((res) => res.data.data);
};

export const getMaintenancesByCourtSlug = async (courtSlug: string): Promise<Maintenance[]> => {
  return await api.get(`/maintenances/court/${courtSlug}`).then((res) => res.data.data);
};

export const getMaintenancesByStatus = async (status: MaintenanceStatus): Promise<Maintenance[]> => {
  return await api.get(`/maintenances/status/${status}`).then((res) => res.data.data);
};

// ========================
// POST endpoints
// ========================

export const createMaintenance = async (
  payload: CreateMaintenanceDTO
): Promise<MaintenanceCreatedResponse> => {
  return await api.post("/maintenances", payload).then((res) => res.data.data);
};

// ========================
// PATCH endpoints
// ========================

export const updateMaintenanceStatus = async (
  slug: string,
  status: MaintenanceStatus
): Promise<Maintenance> => {
  return await api
    .patch(`/maintenances/${slug}/status`, { status })
    .then((res) => res.data.data);
};

export const cancelMaintenance = async (slug: string): Promise<void> => {
  return await api.patch(`/maintenances/${slug}/cancel`).then((res) => res.data.data);
};

// ========================
// DELETE endpoints
// ========================

export const deleteMaintenance = async (slug: string): Promise<void> => {
  return await api.delete(`/maintenances/${slug}`).then((res) => res.data.data);
};
