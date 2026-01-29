import { useQuery } from "@tanstack/react-query";
import { searchMonitors } from "../services/auth.sp.service";

export const useMonitorsQuery = (username?: string) => {
  return useQuery({
    queryKey: ["users", "monitors", username],
    queryFn: () => searchMonitors(username),
  });
};
