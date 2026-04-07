import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { deleteClassByMonitor } from "@/features/bookings/services/class.sp.service";

export const useDeleteBookingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, { uuid: string; username: string }>({
    mutationFn: ({ uuid, username }) => deleteClassByMonitor(uuid, username),
    onSuccess: (_data, variables) => {
      const org = variables?.username;
      if (org) {
        queryClient.invalidateQueries({ queryKey: ["classes", org] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["classes"] });
      }
      queryClient.invalidateQueries({ queryKey: ["booked-slots"] });
      toast.success("Clase eliminada");
    },
    onError: (err) => {
      toast.error("No se pudo eliminar la clase", { description: err?.message });
    },
  });
};

export default useDeleteBookingMutation;
