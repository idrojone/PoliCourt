import { useQuery } from "@tanstack/react-query";
import { getClassMonitor } from "../services/class.sp.service";

export const useClasessesQuery = (params: { username?: string }) => {
    return useQuery({
        queryKey: ["classes", params.username ?? null],
        queryFn: () => getClassMonitor(params.username!),
        enabled: Boolean(params.username),
    });
};