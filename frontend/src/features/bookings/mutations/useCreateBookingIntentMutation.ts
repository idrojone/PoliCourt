import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBookingIntent } from "@/features/bookings/services/booking.sp.service";
import type { BookingPayload } from "@/features/types/bookings/BookingPayload";
import type { PaymentIntentCreateResponse } from "@/features/types/bookings/PaymentIntentCreateResponse";

export const useCreateBookingIntentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<PaymentIntentCreateResponse, Error, BookingPayload>({
    mutationFn: createBookingIntent,
    onSuccess: (_data, variables) => {
      const organizer = variables.organizerUsername;
      if (organizer) {
        queryClient.invalidateQueries({ queryKey: ["user-rentals", organizer] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["user-rentals"] });
      }
      queryClient.invalidateQueries({ queryKey: ["booked-slots"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
