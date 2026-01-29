import { useQuery } from "@tanstack/react-query";
import { getTournaments } from "../service/booking.sp.service";

export const useTournamentsQuery = () => {
  return useQuery({
    queryKey: ["bookings", "tournaments"],
    queryFn: () => getTournaments(),
  });
};
