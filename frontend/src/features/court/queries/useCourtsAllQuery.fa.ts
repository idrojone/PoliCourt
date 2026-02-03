import { useQuery } from "@tanstack/react-query";
import { getCourts } from "../service/court.fa.service";

export const useCourtsAllQuery = () => {
    return useQuery({
    queryKey: ["courts-all"],
    queryFn: () => getCourts(),
  });
}