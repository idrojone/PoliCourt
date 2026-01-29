import { useQuery } from "@tanstack/react-query";
import { getRentals } from "../service/booking.sp.service";

export const useRentalsQuery = () => {
  return useQuery({
    queryKey: ["bookings", "rentals"],
    queryFn: () => getRentals(),
  });
};
