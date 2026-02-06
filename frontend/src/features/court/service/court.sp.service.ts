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
  // If surface or status are arrays, build query string to send repeated params
  if (Array.isArray(params.surface) || Array.isArray(params.status)) {
    const sp = new URLSearchParams();
    if (params.q) sp.append("q", params.q);
    if (params.name) sp.append("name", params.name);
    if (params.locationDetails) sp.append("locationDetails", params.locationDetails);
    if (params.priceMin != null) sp.append("priceMin", String(params.priceMin));
    if (params.priceMax != null) sp.append("priceMax", String(params.priceMax));
    if (params.capacityMin != null) sp.append("capacityMin", String(params.capacityMin));
    if (params.capacityMax != null) sp.append("capacityMax", String(params.capacityMax));
    if (params.isIndoor != null) sp.append("isIndoor", String(params.isIndoor));
    params.surface?.forEach((s) => sp.append("surface", s));
    params.status?.forEach((s) => sp.append("status", s));
    if (params.isActive != null) sp.append("isActive", String(params.isActive));
    if (params.page != null) sp.append("page", String(params.page));
    if (params.limit != null) sp.append("limit", String(params.limit));
    if (params.sort) sp.append("sort", params.sort);
    return await api.get(`/courts?${sp.toString()}`).then((res) => res.data.data as PageCourtResponse);
  }
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

