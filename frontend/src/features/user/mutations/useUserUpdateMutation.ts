import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { updateUser } from "../service/user.sp.service";
import type { User } from "@/features/types/user/User";
import type { UserUpdateRequest } from "@/features/types/user/UserUpdateRequests";

export const useUserUpdateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<
        User,
        AxiosError<{ message: string }>,
        { username: string; payload: UserUpdateRequest }
    >({
        mutationFn: ({ username, payload }) => updateUser(username, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["users-page"] });
            queryClient.invalidateQueries({ queryKey: ["user", variables.username] });
        },
    });
};
