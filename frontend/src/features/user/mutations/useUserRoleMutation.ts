import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "../service/user.sp.service";

export const useUserRoleMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            username,
            role,
        }: {
            username: string;
            role: string;
        }) => updateUserRole(username, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users-page"] });
        },
    });
};
