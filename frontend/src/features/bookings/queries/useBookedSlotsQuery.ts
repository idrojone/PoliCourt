import { useQuery } from "@tanstack/react-query";
import { getBookedSlots } from "@/features/bookings/services/booking.sp.service";

export const useBookedSlotsQuery = (courtSlug: string, enabled = true) => {
  return useQuery({
    queryKey: ["booked-slots", courtSlug],
    queryFn: () => getBookedSlots(courtSlug),
    enabled: enabled && !!courtSlug,
    staleTime: 60_000,
  });
};
