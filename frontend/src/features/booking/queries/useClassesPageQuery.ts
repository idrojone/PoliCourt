import type { GetBookingsParams, PageBookingResponse } from "@/features/types/booking";
import { useQuery } from "@tanstack/react-query";
import { getClassesPage } from "../service/booking.sp.service";

export const useClassesPageQuery = (params: GetBookingsParams) => {
    return useQuery<PageBookingResponse>({
        queryKey: ["bookings", "classes", params],
        queryFn: () => getClassesPage(params),
    });
};
