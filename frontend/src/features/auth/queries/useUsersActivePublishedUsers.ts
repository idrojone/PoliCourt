import { useQuery } from "@tanstack/react-query";
import { getActivePublishedUsers } from "../services/auth.fa.service";

export const useUsersActivePublishedUsers = () => {
  return useQuery({
    queryKey: ["users-active-published"],
    queryFn: () => getActivePublishedUsers(),
  });
};