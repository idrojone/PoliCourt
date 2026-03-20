import type { GetSportsParams } from "@/features/types/sport/GetSportsParams";
import { getSportsActivePublished } from "../service/sport.fa.service";
import { useQuery } from "@tanstack/react-query";


export const useSportsPageQuery = (params: Partial<GetSportsParams>) => {
    return useQuery({
        queryKey: ["sports-page", params],
        queryFn: () => getSportsActivePublished(params),
    })
}