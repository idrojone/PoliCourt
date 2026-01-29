import { useQuery } from "@tanstack/react-query";
import { searchClubAdmins } from "../services/auth.sp.service";

export const useClubAdminsQuery = (username?: string) => {
  return useQuery({
    queryKey: ["users", "club-admins", username],
    queryFn: () => searchClubAdmins(username),
  });
};
