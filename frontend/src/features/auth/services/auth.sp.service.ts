import type { UserRole } from "@/features/types/auth/UserRole";
import type { UserStatus } from "@/features/types/auth/UserStatus";
import type { UserForAdmin } from "@/features/types/auth/User";
import { api } from "@/lib/axios.sb";

export const getUsers = async () => {
  return await api.get("/auth/users").then((res) => res.data);
};

export const searchUsers = async (username: string): Promise<UserForAdmin[]> => {
  if (!username) return [];
  return await api
    .get(`/auth/users/search?username=${username}`)
    .then((res) => res.data.data || res.data);
};

// ========================
// BÚSQUEDA POR ROL
// ========================

export const searchUsersByRole = async (role: string, username?: string): Promise<UserForAdmin[]> => {
  const roleEndpoints: Record<string, string> = {
    USER: "/auth/users/role/user/search",
    COACH: "/auth/users/role/coach/search",
    MONITOR: "/auth/users/role/monitor/search",
    CLUB_ADMIN: "/auth/users/role/club-admin/search",
  };

  const endpoint = roleEndpoints[role];
  if (!endpoint) return [];

  const params = username ? `?username=${username}` : "";
  return await api.get(`${endpoint}${params}`).then((res) => res.data.data || res.data);
};

export const searchRegularUsers = async (username?: string): Promise<UserForAdmin[]> => {
  const params = username ? `?username=${username}` : "";
  return await api.get(`/auth/users/role/user/search${params}`).then((res) => res.data.data || res.data);
};

export const searchCoaches = async (username?: string): Promise<UserForAdmin[]> => {
  const params = username ? `?username=${username}` : "";
  return await api.get(`/auth/users/role/coach/search${params}`).then((res) => res.data.data || res.data);
};

export const searchMonitors = async (username?: string): Promise<UserForAdmin[]> => {
  const params = username ? `?username=${username}` : "";
  return await api.get(`/auth/users/role/monitor/search${params}`).then((res) => res.data.data || res.data);
};

export const searchClubAdmins = async (username?: string): Promise<UserForAdmin[]> => {
  const params = username ? `?username=${username}` : "";
  return await api.get(`/auth/users/role/club-admin/search${params}`).then((res) => res.data.data || res.data);
};

// ========================
// ACTUALIZACIÓN DE USUARIOS
// ========================

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
