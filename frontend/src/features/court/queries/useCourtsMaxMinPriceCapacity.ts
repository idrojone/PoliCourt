import { useQuery } from "@tanstack/react-query";
import { getMaxMinPriceCapacityCourt } from "../service/court.fa.service";
import type { GetCourtsParams } from "@/features/types/court/GetCourtsParams";

export const useCourtsMaxMinPriceCapacity = (params?: Partial<GetCourtsParams>) => {
  return useQuery<{min_price:number, max_price:number, min_capacity:number, max_capacity:number}>({
    queryKey: ["courts-max-min-price-capacity", params || {}],
    queryFn: () => getMaxMinPriceCapacityCourt(params),
  });
};