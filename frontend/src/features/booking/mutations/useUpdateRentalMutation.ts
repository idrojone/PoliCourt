import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRental } from "../service/booking.sp.service";
import type { Booking, UpdateRentalDTO } from "@/features/types/booking";
import type { AxiosError } from "axios";

interface UpdateRentalParams {
  slug: string;
  payload: UpdateRentalDTO;
}

/**
 * Mutation para actualizar un RENTAL.
 * Solo se pueden modificar: startTime, endTime.
 * El precio se recalcula automáticamente.
 */
export const useUpdateRentalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Booking, AxiosError<{ message: string }>, UpdateRentalParams>({
    mutationFn: ({ slug, payload }) => updateRental(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "rentals"] });
    },
  });
};
