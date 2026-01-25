import type { GeneralStatusType } from "@/types";
import { api } from "@/lib/axios.sb";
import type { Court } from "@/features/types/court/Court";
import type { CreateCourtDTO } from "@/features/types/court/CreateCourtDTO";

export const getCourts = async (): Promise<Court[]> => {
  return await api
    .get("/courts")
    .then((res) => res.data.data)
    .then((data) => {
      console.log("Fetch court", data);
      return data;
    });
};

export const createCourt = async (payload: CreateCourtDTO): Promise<Court> => {
  return await api.post("/courts", payload).then((res) => res.data.data);
};

export const updateCourt = async (
  slug: string,
  payload: Partial<CreateCourtDTO>,
): Promise<Court> => {
  return await api.put(`/courts/${slug}`, payload).then((res) => res.data.data);
};

export const toggleCourtActive = async (slug: string): Promise<Court> => {
  return await api.patch(`/courts/${slug}/active`).then((res) => res.data.data);
};

export const updateCourtStatus = async (
  slug: string,
  status: GeneralStatusType,
): Promise<Court> => {
  return await api
    .patch(`/courts/${slug}/status/${status}`)
    .then((res) => res.data.data);
};
