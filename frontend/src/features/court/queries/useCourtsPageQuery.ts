import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCourts } from "../service/court.sp.service";
import type { GetCourtsParams } from "@/features/types/court/GetCourtsParams";

export const useCourtsPageQuery = (params: GetCourtsParams) => {
    return useQuery({
        queryKey: ["courts-page", params],
        queryFn: () => getCourts(params),
        placeholderData: keepPreviousData,
    });
};
