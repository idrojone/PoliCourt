import type { GeneralStatusType } from "@/types";
import { api } from "@/lib/axios.sb";
import type { Court } from "@/features/types/court/Court";
import type { CreateCourtDTO } from "@/features/types/court/CreateCourtDTO";
import type { GetCourtsParams } from "@/features/types/court/GetCourtsParams";
import type { PageCourtResponse } from "@/features/types/court/PageCourtResponse";

export const getCourts = async (): Promise<Court[]> => {
  const res = await api.get("/courts", { params: { page: 1, limit: 1000 } });
  const data = res.data.data;
  return data?.content || data;
};

export const getCourtsPage = async (
  params: Partial<GetCourtsParams> = {},
): Promise<PageCourtResponse> => {
  return await api.get("/courts", { params }).then((res) => res.data.data as PageCourtResponse);
};

export const createCourt = async (payload: CreateCourtDTO): Promise<Court> => {
  return await api.post("/courts", payload).then((res) => res.data.data);
};

export const getCourtsActivePublished = async (): Promise<Court[]> => {
  const res = await api.get("/courts", {
    params: { status: "PUBLISHED", isActive: true, page: 1, limit: 1000 },
  });
  const data = res.data.data;
  const list = Array.isArray(data) ? data : data?.content || [];
  return list;
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

