import { useQuery } from "@tanstack/react-query";
import { getSportSlugs } from "../service/sport.sp.service";

export const useSportsSlugQuery = () => {
    return useQuery({
        queryKey: ["sports-slugs"],
        queryFn: () => getSportSlugs(),
    });
}