import { useMutation } from "@tanstack/react-query";
import { createBookingIntent } from "@/features/bookings/services/booking.sp.service";
import type { BookingPayload } from "@/features/types/bookings/BookingPayload";
import type { PaymentIntentCreateResponse } from "@/features/types/bookings/PaymentIntentCreateResponse";

export const useCreateBookingIntentMutation = () => {
  return useMutation<PaymentIntentCreateResponse, Error, BookingPayload>({
    mutationFn: createBookingIntent,
  });
};
