import { useQuery } from "@tanstack/react-query";
import {
  searchUsersByRole,
  searchRegularUsers,
  searchCoaches,
  searchMonitors,
  searchClubAdmins,
  searchUsers,
} from "../services/auth.sp.service";

export const useUsersByRoleQuery = (role: string, username?: string) => {
  return useQuery({
    queryKey: ["users-by-role", role, username],
    queryFn: () => searchUsersByRole(role, username),
    enabled: !!role,
  });
};

/**
 * Busca usuarios sin filtrar por rol (búsqueda general).
 * Si username está vacío o tiene menos de 2 caracteres, no ejecuta.
 */
export const useUsersSearchQuery = (username: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["users-search", username],
    queryFn: () => searchUsers(username),
    enabled: enabled && !!username && username.length >= 2,
  });
};

export const useRegularUsersQuery = (username?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["users-regular", username],
    queryFn: () => searchRegularUsers(username),
    enabled: enabled && (username === undefined || username === "" || username.length >= 2),
  });
};

export const useCoachesQuery = (username?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["users-coaches", username],
    queryFn: () => searchCoaches(username),
    enabled: enabled && (username === undefined || username === "" || username.length >= 2),
  });
};

export const useMonitorsQuery = (username?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["users-monitors", username],
    queryFn: () => searchMonitors(username),
    enabled: enabled && (username === undefined || username === "" || username.length >= 2),
  });
};

export const useClubAdminsQuery = (username?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["users-club-admins", username],
    queryFn: () => searchClubAdmins(username),
    enabled: enabled && (username === undefined || username === "" || username.length >= 2),
  });
};
