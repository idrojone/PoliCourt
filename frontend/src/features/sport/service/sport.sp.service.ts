import type { CreateSportDTO } from "@/features/types/sport/CreateSportDTO";
import type { GetSportsParams } from "@/features/types/sport/GetSportsParams";
import type { GeneralStatusType } from "@/types";
import { api } from "@/lib/axios.sb";

export const getSports = async (params: GetSportsParams = {}) => {
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

export const deleteSport = async (slug: string) => {
  return await api.delete(`/sports/${slug}`).then((res) => res.data.data);
};

export const restoreSport = async (slug: string) => {
  return await api.patch(`/sports/${slug}/restore`).then((res) => res.data.data);
};

export const updateSportStatus = async (slug: string, status: GeneralStatusType) => {
  return await api.patch(`/sports/${slug}/status`, JSON.stringify(status)).then((res) => res.data.data);
};
