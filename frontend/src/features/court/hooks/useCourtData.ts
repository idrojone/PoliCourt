import { useCourtsState } from "./useCourtsState";
import { useCourtsPageQuery } from "../queries/useCourtsPageQuery";

export function useCourtData() {
  const { apiParams, page, setPage } = useCourtsState();

  const { data, isLoading, isError } = useCourtsPageQuery(apiParams as any);

  const pageData = data as any;
  const courts = pageData?.content || [];
  const totalPages = pageData?.totalPages ?? 1;

  return { courts, page, setPage, totalPages, isLoading, isError };
}
