import type { GetBookingsParams, PageBookingResponse } from "@/features/types/booking";
import { useQuery } from "@tanstack/react-query";
import { getRentalsPage } from "../service/booking.sp.service";

export const useRentalsPageQuery = (params: GetBookingsParams) => {
    return useQuery<PageBookingResponse>({
        queryKey: ["bookings", "rentals", params],
        queryFn: () => getRentalsPage(params),
    });
};
