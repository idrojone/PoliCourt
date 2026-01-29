import { useQuery } from "@tanstack/react-query";
import { searchRegularUsers } from "../services/auth.sp.service";

export const useRegularUsersQuery = (username?: string) => {
  return useQuery({
    queryKey: ["users", "regular", username],
    queryFn: () => searchRegularUsers(username),
  });
};
