import { useQuery } from "@tanstack/react-query";
import { getCourtsActivePublished } from "@/features/court/service/court.sp.service";

export const useCourtsActivePublishedQuery = () => {
  return useQuery({
    queryKey: ["courts-active-published"],
    queryFn: () => getCourtsActivePublished(),
  });
};