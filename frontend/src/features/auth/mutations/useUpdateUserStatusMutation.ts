import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserStatus } from "../services/auth.sp.service";
import { toast } from "sonner";

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      toast.success("User status updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["users-all"] });
      queryClient.invalidateQueries({ queryKey: ["users-search"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user status.");
    },
  });
};
