import { useQuery } from "@tanstack/react-query";
import { getUserRentals } from "../service/user.sp.service";

export const useUserRentalsQuery = (username: string | undefined, page = 1, limit = 5) => {
  return useQuery({
    queryKey: ["user-rentals", username, page, limit],
    queryFn: () => getUserRentals(username!, page, limit),
    enabled: !!username,
  });
};
