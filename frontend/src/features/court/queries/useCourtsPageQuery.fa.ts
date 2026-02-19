import type { GetCourtsParams } from "@/features/types/court/GetCourtsParams";
import { useQuery } from "@tanstack/react-query";
import { getCourts } from "../service/court.fa.service";
import { keepPreviousData } from "@tanstack/react-query";

export const useCourtsPageQuery = (params: Partial<GetCourtsParams>) => {
    return useQuery({
        queryKey: ["courts-page", params],
        queryFn: () => getCourts(params),
        placeholderData: keepPreviousData,
    })
}