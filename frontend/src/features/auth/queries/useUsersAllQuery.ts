import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/auth.sp.service";

export const useUsersAllQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["users-all"],
    queryFn: () => getUsers(),
    enabled,
  });
};
