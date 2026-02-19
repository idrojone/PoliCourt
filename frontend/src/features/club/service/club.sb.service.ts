import type { ClubCreateRequest } from "@/features/types/club/ClubCreateRequest";
import type { ClubUpdateRequest } from "@/features/types/club/ClubUpdateRequest";
import type { GetClubsParams } from "@/features/types/club/GetClubsParams";
import type { ClubStatus } from "@/features/types/club/Club";
import { api } from "@/lib/axios.sb";

export const getClubs = async (params: GetClubsParams = {}) => {
    return await api.get("/clubs", { params }).then((res) => res.data.data);
};

export const createClub = async (payload: ClubCreateRequest) => {
    return await api.post("/clubs", payload).then((res) => res.data.data);
};

export const updateClub = async (
    slug: string,
    payload: ClubUpdateRequest,
) => {
    return await api.put(`/clubs/${slug}`, payload).then((res) => res.data.data);
};

export const deleteClub = async (slug: string) => {
    return await api.delete(`/clubs/${slug}`).then((res) => res.data.data);
};

export const restoreClub = async (slug: string) => {
    return await api.patch(`/clubs/${slug}/restore`).then((res) => res.data.data);
};

export const updateClubStatus = async (slug: string, status: ClubStatus) => {
    return await api.patch(`/clubs/${slug}/status`, { status }).then((res) => res.data.data);
};
