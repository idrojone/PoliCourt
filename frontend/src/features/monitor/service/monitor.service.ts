import { api } from "@/lib/axios.ns";
import { getToken } from "@/lib/token";

const SERVER_BASE_URL = import.meta.env.VITE_API_URL_NS || "http://localhost:4002";

export type MonitorApplication = {
  email: string;
  description: string;
  documents: string[];
  status: "pending" | "approved" | "rejected" | string;
  uuid: string;
  createdAt: string;
};

export type ApplicationsPayload = {
  items: MonitorApplication[];
  total: number | null;
};

const normalizePayload = (payload: any): ApplicationsPayload => {
  if (Array.isArray(payload)) return { items: payload, total: null };
  if (Array.isArray(payload?.data)) return { items: payload.data, total: null };
  if (Array.isArray(payload?.data?.items)) {
    const total = typeof payload.data?.pagination?.total === "number" ? payload.data.pagination.total : null;
    return { items: payload.data.items, total };
  }
  if (Array.isArray(payload?.applications)) return { items: payload.applications, total: null };
  if (Array.isArray(payload?.rows)) return { items: payload.rows, total: null };
  return { items: [], total: null };
};

export const fetchApplications = async (status: "all" | "pending" | "approved" | "rejected"): Promise<ApplicationsPayload> => {
  const token = getToken();
  if (!token) throw new Error("No se encontró token. Por favor inicia sesión como administrador.");

  const response = await api.get(`/monitor/all-applications`, {
    params: { status: status === "all" ? undefined : status },
  });

  return normalizePayload(response.data);
};

export const changeApplicationStatus = async (uuid: string, status: "approved" | "rejected") => {
  const token = getToken();
  if (!token) throw new Error("No se encontró token. Por favor inicia sesión como administrador.");

  const response = await api.post(`/monitor/change-status`, { uuid, status });

  return response.data;
};

export const getUploadUrl = (path: string) => {
  const normalized = path.replace(/\\/g, "/");
  if (normalized.startsWith("http")) return normalized;
  const uploadsIndex = normalized.toLowerCase().indexOf("/uploads/");
  if (uploadsIndex !== -1) {
    const relative = normalized.slice(uploadsIndex + 1);
    return `${SERVER_BASE_URL}/${relative}`;
  }
  return `${SERVER_BASE_URL}/${normalized}`;
};
