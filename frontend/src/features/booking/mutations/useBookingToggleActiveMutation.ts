import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleBookingActive } from "../service/booking.sp.service";
import type { Booking } from "@/features/types/booking";
import type { AxiosError } from "axios";

export const useBookingToggleActiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Booking, AxiosError<{ message: string }>, string>({
    mutationFn: (slug: string) => toggleBookingActive(slug),
    onSuccess: () => {
      // Invalidamos todas las queries de bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
