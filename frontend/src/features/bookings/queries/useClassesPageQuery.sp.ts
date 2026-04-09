import { useQuery } from "@tanstack/react-query";
import { searchClasses } from "../services/class.sp.service";
import type { BookingSearchParams } from "@/features/types/bookings/BookingRecord";

export const useClassesPageQuery = (params: BookingSearchParams) => {
    return useQuery({
        queryKey: ["classes-page", params],
        queryFn: () => searchClasses(params),
        placeholderData: (previousData: any) => previousData,
    });
};

export default useClassesPageQuery;
