import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelBookingByUser } from "@/features/bookings/services/booking.sp.service";
import type { BookingCancellationResponse } from "@/features/types/bookings/BookingCancellationResponse";

interface CancelBookingVariables {
  bookingUuid: string;
  username: string;
}

export const useCancelBookingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<BookingCancellationResponse, Error, CancelBookingVariables>({
    mutationFn: ({ bookingUuid, username }) =>
      cancelBookingByUser(bookingUuid, username),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["booked-slots"] });

      toast.success("Reserva cancelada", {
        description: data.refunded
          ? "La reserva se canceló y se aplicó reembolso."
          : "La reserva se canceló correctamente.",
      });
    },
    onError: (error) => {
      toast.error("No se pudo cancelar la reserva", {
        description: error.message,
      });
    },
  });
};
