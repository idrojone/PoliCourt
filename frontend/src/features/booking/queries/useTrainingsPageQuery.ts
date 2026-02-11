import type { GetBookingsParams, PageBookingResponse } from "@/features/types/booking";
import { useQuery } from "@tanstack/react-query";
import { getTrainingsPage } from "../service/booking.sp.service";

export const useTrainingsPageQuery = (params: GetBookingsParams) => {
    return useQuery<PageBookingResponse>({
        queryKey: ["bookings", "trainings", params],
        queryFn: () => getTrainingsPage(params),
    });
};
