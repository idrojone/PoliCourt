import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRental } from "../service/booking.sp.service";
import type { Booking, CreateRentalDTO } from "@/features/types/booking";
import type { AxiosError } from "axios";

/**
 * Mutation para crear un RENTAL (alquiler de pista).
 * Solo requiere: courtSlug, organizerUsername, startTime, endTime.
 * El backend genera el título y calcula el precio automáticamente.
 */
export const useCreateRentalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Booking, AxiosError<{ message: string }>, CreateRentalDTO>({
    mutationFn: (payload: CreateRentalDTO) => createRental(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "rentals"] });
    },
  });
};
