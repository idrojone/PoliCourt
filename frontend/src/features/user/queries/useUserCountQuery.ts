import { useQuery } from "@tanstack/react-query";
import { getUserCount } from "../service/user.fa.service";

export const useUserCountQuery = () => {
    return useQuery({
        queryKey: ["user-count"],
        queryFn: getUserCount,
    });
};
