import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClassEnrollmentIntent } from "@/features/bookings/services/booking.sp.service";
import type { ClassEnrollmentRequest } from "@/features/types/bookings/ClassEnrollmentRequest";
import type { PaymentIntentCreateResponse } from "@/features/types/bookings/PaymentIntentCreateResponse";

export const useCreateClassEnrollmentIntentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PaymentIntentCreateResponse, Error, ClassEnrollmentRequest>({
    mutationFn: createClassEnrollmentIntent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
