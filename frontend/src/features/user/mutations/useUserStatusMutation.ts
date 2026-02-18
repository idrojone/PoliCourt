import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserStatus } from "../service/user.sp.service";
import type { GeneralStatusType } from "@/types";

export const useUserStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            username,
            status,
        }: {
            username: string;
            status: GeneralStatusType;
        }) => updateUserStatus(username, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-page"] });
        },
    });
};
