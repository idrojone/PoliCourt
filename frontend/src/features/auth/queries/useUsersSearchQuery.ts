import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "../services/auth.sp.service";

export const useUsersSearchQuery = (username: string) => {
  return useQuery({
    queryKey: ["users-search", username],
    queryFn: () => searchUsers(username),
    enabled: !!username, // Solo se ejecuta si el username no está vacío
  });
};
