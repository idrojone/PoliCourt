import { useQuery } from "@tanstack/react-query";
import { getSports } from "../api/sportApi";
import type { Sport } from "../types";
import db from "../db/deportes.json";
import { deportes } from "@/routes/nav";

export const useSport = (params?: Record<string, any>) => {
    const query = useQuery<Sport[], Error>({
        queryKey: ["sports", params],
        queryFn: () => getSports(params),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    // return {
    //     deportes: query.data ?? [],
    //     isLoading: query.isLoading,
    //     isFetching: query.isFetching,
    //     isError: query.isError,
    //     error: query.error,
    //     refetch: query.refetch,
    // };

    return {
        deportes: db,
    }
};