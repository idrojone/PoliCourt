import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRental } from "../service/booking.sp.service";
import type { Booking, CreateBookingDTO } from "@/features/types/booking";
import type { AxiosError } from "axios";

export const useCreateRentalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Booking, AxiosError<{ message: string }>, CreateBookingDTO>({
    mutationFn: (payload: CreateBookingDTO) => createRental(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "rentals"] });
    },
  });
};
