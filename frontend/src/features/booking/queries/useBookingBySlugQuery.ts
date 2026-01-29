import { useQuery } from "@tanstack/react-query";
import { getBookingBySlug } from "../service/booking.sp.service";

export const useBookingBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: ["bookings", "detail", slug],
    queryFn: () => getBookingBySlug(slug),
    enabled: !!slug,
  });
};
