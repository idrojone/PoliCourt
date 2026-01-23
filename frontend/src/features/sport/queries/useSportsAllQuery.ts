import { useQuery } from "@tanstack/react-query";
import { getSports } from "../service/sport.sp.service";

export const useSportsAllQuery = () => {
  return useQuery({
    queryKey: ["sports-all"],
    queryFn: () => getSports(),
  });
};
