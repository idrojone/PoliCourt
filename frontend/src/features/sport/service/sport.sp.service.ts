import type { CreateSportDTO } from "@/features/types/sport/CreateSportDTO";
import type { GetSportsParams } from "@/features/types/sport/GetSportsParams";
import { api } from "@/lib/axios.sb";
import type { GeneralStatusType } from "@/types";

export const getSports = async () => {
  return await api.get("/sports", { params: { limit: 1000 } }).then((res) => res.data.data.content);
};


export const getSportsPage = async (params: GetSportsParams = {}) => {
  // Si status es arreglo, construimos query string manualmente para enviar status=VAL multiple veces
  if (params.status && Array.isArray(params.status)) {
    const sp = new URLSearchParams();
    if (params.q) sp.append("q", params.q);
    params.status.forEach((s) => sp.append("status", s));
    if (params.isActive != null) sp.append("isActive", String(params.isActive));
    if (params.page) sp.append("page", String(params.page));
    if (params.limit) sp.append("limit", String(params.limit));
    if (params.sort) sp.append("sort", params.sort);
    return await api.get(`/sports?${sp.toString()}`).then((res) => res.data.data);
  }

  return await api.get("/sports", { params }).then((res) => res.data.data);
};

export const createSport = async (payload: CreateSportDTO) => {
  return await api.post("/sports", payload).then((res) => res.data.data);
};

export const updateSport = async (
  slug: string,
  payload: Partial<CreateSportDTO>,
) => {
  return await api.put(`/sports/${slug}`, payload).then((res) => res.data.data);
};

export const toggleSportActive = async (slug: string) => {
  return await api.patch(`/sports/${slug}/active`).then((res) => res.data.data);
};

export const updateSportStatus = async (
  slug: string,
  status: GeneralStatusType,
) => {
  return await api
    .patch(`/sports/${slug}/status`, { status })
    .then((res) => res.data.data);
};
