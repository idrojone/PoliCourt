import { useQuery } from "@tanstack/react-query";
import { searchBookings } from "@/features/bookings/services/booking.sp.service";
import type { BookingPage } from "@/features/types/bookings/BookingRecord";

export const useDashboardBookingsQuery = () => {
  return useQuery<BookingPage>({
    queryKey: ["dashboard-bookings"],
    queryFn: () =>
      searchBookings({
        page: 1,
        limit: 200,
        sort: "startTime_asc",
        isActive: true,
      }),
    staleTime: 60_000,
  });
};
