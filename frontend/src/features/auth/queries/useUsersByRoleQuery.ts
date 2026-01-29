import { useQuery } from "@tanstack/react-query";
import {
  searchUsersByRole,
  searchRegularUsers,
  searchCoaches,
  searchMonitors,
  searchClubAdmins,
} from "../services/auth.sp.service";

export const useUsersByRoleQuery = (role: string, username?: string) => {
  return useQuery({
    queryKey: ["users-by-role", role, username],
    queryFn: () => searchUsersByRole(role, username),
    enabled: !!role,
  });
};

export const useRegularUsersQuery = (username?: string) => {
  return useQuery({
    queryKey: ["users-regular", username],
    queryFn: () => searchRegularUsers(username),
    enabled: username !== undefined && username.length >= 2,
  });
};

export const useCoachesQuery = (username?: string) => {
  return useQuery({
    queryKey: ["users-coaches", username],
    queryFn: () => searchCoaches(username),
    enabled: username !== undefined && username.length >= 2,
  });
};

export const useMonitorsQuery = (username?: string) => {
  return useQuery({
    queryKey: ["users-monitors", username],
    queryFn: () => searchMonitors(username),
    enabled: username !== undefined && username.length >= 2,
  });
};

export const useClubAdminsQuery = (username?: string) => {
  return useQuery({
    queryKey: ["users-club-admins", username],
    queryFn: () => searchClubAdmins(username),
    enabled: username !== undefined && username.length >= 2,
  });
};
