import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleUserActive } from "../services/auth.sp.service";
import { toast } from "sonner";

export const useToggleUserActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleUserActive,
    onSuccess: () => {
      toast.success("User active status toggled successfully.");
      queryClient.invalidateQueries({ queryKey: ["users-all"] });
      queryClient.invalidateQueries({ queryKey: ["users-search"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to toggle user active status.");
    },
  });
};
