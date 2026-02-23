import { useQuery } from "@tanstack/react-query";
import { getUser } from "../service/user.fa.service";

export const useProfileQuery = (username: string | undefined) => {
    return useQuery({
        queryKey: ["user", username],
        queryFn: () => getUser(username!),
        enabled: !!username,
    });
}