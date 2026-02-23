import { api } from "@/lib/axios.sb";
import type { GetUsersParams } from "@/features/types/user/GetUsersParams";
import type { UserUpdateRequest, UserStatusUpdateRequest, UserRoleUpdateRequest } from "@/features/types/user/UserUpdateRequests";
import type { GeneralStatusType } from "@/types";

export const getUsers = async (params: GetUsersParams = {}) => {
    return await api.get("/users", { params }).then((res) => res.data.data);
};

export const getUser = async (username: string) => {
    return await api.get(`/users`, { params: { username } }).then((res) => res.data.data);
};

export const updateUser = async (username: string, payload: UserUpdateRequest) => {
    return await api.put(`/users/${username}`, payload).then((res) => res.data.data);
};

export const deleteUser = async (username: string) => {
    return await api.delete(`/users/${username}`).then((res) => res.data.data);
};

export const restoreUser = async (username: string) => {
    return await api.patch(`/users/${username}/restore`).then((res) => res.data.data);
};

export const updateUserStatus = async (username: string, status: GeneralStatusType) => {
    const payload: UserStatusUpdateRequest = { status };
    return await api.patch(`/users/${username}/status`, payload).then((res) => res.data.data);
};

export const updateUserRole = async (username: string, role: string) => {
    const payload: UserRoleUpdateRequest = { role };
    return await api.patch(`/users/${username}/role`, payload).then((res) => res.data.data);
};
