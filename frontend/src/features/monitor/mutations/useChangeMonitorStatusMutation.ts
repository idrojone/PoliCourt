import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeApplicationStatus } from "@/features/monitor/service/monitor.service";
import { toast } from "sonner";

type ChangePayload = { uuid: string; status: "approved" | "rejected" };

export const useChangeMonitorStatusMutation = () => {
  const qc = useQueryClient();

  return useMutation<any, Error, ChangePayload>({
    mutationFn: ({ uuid, status }: ChangePayload) => changeApplicationStatus(uuid, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["monitor-applications"] });
      toast.success("Estado actualizado.");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("No se pudo actualizar el estado. Intenta nuevamente.");
    },
  });
};

export default useChangeMonitorStatusMutation;
