import { api } from "@/lib/axios.sb";
import type { CreateCourtDTO } from "@/features/types/court/CreateCourtDTO";
import type { UpdateCourtDTO } from "@/features/types/court/UpdateCourtDTO";
import type { GetCourtsParams } from "@/features/types/court/GetCourtsParams";
import type { GeneralStatusType } from "@/types";

export const getCourts = async (params: GetCourtsParams = {}) => {
    return await api.get("/courts", { params }).then((res) => res.data.data);
};

export const createCourt = async (payload: CreateCourtDTO) => {
    return await api.post("/courts", payload).then((res) => res.data.data);
};

export const updateCourt = async (
    slug: string,
    payload: UpdateCourtDTO
) => {
    return await api.put(`/courts/${slug}`, payload).then((res) => res.data.data);
};

export const deleteCourt = async (slug: string) => {
    return await api.delete(`/courts/${slug}`).then((res) => res.data.data);
};

export const restoreCourt = async (slug: string) => {
    return await api.patch(`/courts/${slug}/restore`).then((res) => res.data.data);
};

export const updateCourtStatus = async (
    slug: string,
    status: GeneralStatusType
) => {
    return await api
        .patch(`/courts/${slug}/status`, { status })
        .then((res) => res.data.data);
};
