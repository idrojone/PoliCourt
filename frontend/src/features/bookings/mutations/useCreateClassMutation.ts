import { useMutation } from "@tanstack/react-query";
import { createClass } from "@/features/bookings/services/class.sp.service";
import { queryClient } from "@/lib/queryClient";

export const useCreateClassMutation = (organizerUsername: string | undefined) => {
  return useMutation({
    mutationFn: (payload: any) => createClass({ ...payload, organizerUsername: organizerUsername! }),
    onSuccess: () => {
      if (organizerUsername) {
        queryClient.invalidateQueries({ queryKey: ["classes", organizerUsername] });
      }
    },
  });
};

export default useCreateClassMutation;
