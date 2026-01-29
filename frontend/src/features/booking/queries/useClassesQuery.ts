import { useQuery } from "@tanstack/react-query";
import { getClasses } from "../service/booking.sp.service";

export const useClassesQuery = () => {
  return useQuery({
    queryKey: ["bookings", "classes"],
    queryFn: () => getClasses(),
  });
};
