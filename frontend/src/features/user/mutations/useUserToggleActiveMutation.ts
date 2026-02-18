import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, restoreUser } from "../service/user.sp.service";

export const useUserToggleActiveMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ username, isActive }: { username: string; isActive: boolean }) =>
            isActive ? deleteUser(username) : restoreUser(username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-page"] });
        },
    });
};
