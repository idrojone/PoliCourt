import type { GetSportsParams } from "@/features/types/sport/GetSportsParams";
import { useQuery } from "@tanstack/react-query";
import { getSports } from "../service/sport.sp.service";


export const useSportsPageQuery = (params: GetSportsParams) => {
    return useQuery({
        queryKey: ["sports-page", params],
        queryFn: () => getSports(params),
    });
};
