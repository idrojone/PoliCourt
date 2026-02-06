import type { GetCourtsParams } from "@/features/types/court/GetCourtsParams";
import type { PageCourtResponse } from "@/features/types/court/PageCourtResponse";
import { useQuery } from "@tanstack/react-query";
import { getCourtsPage } from "../service/court.sp.service";

export const useCourtsPageQuery = (params: GetCourtsParams) => {
  return useQuery<PageCourtResponse>({
    queryKey: ["courts-page", params],
    queryFn: () => getCourtsPage(params),
  });
};
