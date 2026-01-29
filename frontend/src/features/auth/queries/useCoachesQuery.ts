import { useQuery } from "@tanstack/react-query";
import { searchCoaches } from "../services/auth.sp.service";

export const useCoachesQuery = (username?: string) => {
  return useQuery({
    queryKey: ["users", "coaches", username],
    queryFn: () => searchCoaches(username),
  });
};
