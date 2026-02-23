import { useQuery } from "@tanstack/react-query";
import { getUser } from "../service/user.sp.service";
import type { User } from "@/features/types/user/User";
import type { AxiosError } from "axios";

export const useUserQuery = (username: string | undefined) => {
    return useQuery<User, AxiosError, User>({
        queryKey: ["user", username],
        queryFn: () => getUser(username!),
        enabled: !!username,
    });
};
