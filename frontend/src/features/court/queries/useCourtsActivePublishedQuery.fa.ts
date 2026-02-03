import { useQuery } from "@tanstack/react-query";
import { getCourtsActivePublished } from "../service/court.fa.service";

export const useCourtsActivePublishedQuery = () => {
    return useQuery({
    queryKey: ["courts-active-published"],
    queryFn: () => getCourtsActivePublished(),
  });
}