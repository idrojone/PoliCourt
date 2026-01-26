import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "../services/auth.sp.service";
import { toast } from "sonner";

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      toast.success("User role updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["users-all"] });
      queryClient.invalidateQueries({ queryKey: ["users-search"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user role.");
    },
  });
};
