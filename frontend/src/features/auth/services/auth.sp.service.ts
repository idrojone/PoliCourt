import type { UserRole } from "@/features/types/auth/UserRole";
import type { UserStatus } from "@/features/types/auth/UserStatus";
import { api } from "@/lib/axios.sb";

export const getUsers = async () => {
  return await api.get("/auth/users").then((res) => res.data);
};

export const searchUsers = async (username: string) => {
  if (!username) return [];
  return await api
    .get(`/auth/users/search?username=${username}`)
    .then((res) => res.data);
};

export const updateUserRole = async ({
  username,
  role,
}: {
  username: string;
  role: UserRole;
}) => {
  return await api
    .patch(`/auth/users/${username}/role`, { role })
    .then((res) => res.data);
};

export const updateUserStatus = async ({
  username,
  status,
}: {
  username: string;
  status: UserStatus;
}) => {
  return await api
    .patch(`/auth/users/${username}/status`, { status })
    .then((res) => res.data);
};

export const toggleUserActive = async (username: string) => {
  return await api
    .patch(`/auth/users/${username}/toggle-active`)
    .then((res) => res.data);
};
