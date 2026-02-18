import { useQuery } from "@tanstack/react-query";
import { getSportSlugs } from "../service/sport.sp.service";
import type { SportSlug } from "../schema/SportSchema";

export const useSportSlugsQuery = () => {
    return useQuery<SportSlug[]>({
        queryKey: ["sports-slugs"],
        queryFn: getSportSlugs,
    });
};
