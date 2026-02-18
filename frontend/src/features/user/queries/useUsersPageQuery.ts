import type { GetUsersParams } from "@/features/types/user/GetUsersParams";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../service/user.sp.service";

export const useUsersPageQuery = (params: GetUsersParams) => {
    return useQuery({
        queryKey: ["users-page", params],
        queryFn: () => getUsers(params),
    });
};
