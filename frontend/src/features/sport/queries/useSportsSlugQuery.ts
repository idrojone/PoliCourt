import { useQuery } from "@tanstack/react-query";
import { getSportsSlugs } from "../service/sport.fa.service";

export const useSportsSlugQuery = () => {
  return useQuery({
    queryKey: ["sports-slugs"],
    queryFn: () => getSportsSlugs(),
  });
}