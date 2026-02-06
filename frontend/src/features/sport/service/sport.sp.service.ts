import type { CreateSportDTO } from "@/features/types/sport/CreateSportDTO";
import type { GetSportsParams } from "@/features/types/sport/GetSportsParams";
import { api } from "@/lib/axios.sb";
import type { GeneralStatusType } from "@/types";

export const getSports = async () => {
  return await api.get("/sports", { params: { limit: 1000 } }).then((res) => res.data.data.content);
};


export const getSportsPage = async (params: GetSportsParams = {}) => {
  return await api
    .get("/sports", { params })
    .then((res) => res.data.data);
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
