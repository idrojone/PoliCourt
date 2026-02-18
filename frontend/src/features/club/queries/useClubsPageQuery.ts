import { useQuery } from "@tanstack/react-query";
import { getClubs } from "../service/club.service";
import type { GetClubsParams } from "@/features/types/club/GetClubsParams";

export const useClubsPageQuery = (params: GetClubsParams) => {
    return useQuery({
        queryKey: ["clubs", params],
        queryFn: () => getClubs(params),
        placeholderData: (previousData: any) => previousData,
    });
};
