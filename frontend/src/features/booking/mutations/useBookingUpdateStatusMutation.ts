import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingStatus } from "../service/booking.sp.service";
import type { Booking, BookingStatus } from "@/features/types/booking";
import type { AxiosError } from "axios";

interface UpdateStatusParams {
  slug: string;
  status: BookingStatus;
}

export const useBookingUpdateStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Booking, AxiosError<{ message: string }>, UpdateStatusParams>({
    mutationFn: ({ slug, status }: UpdateStatusParams) =>
      updateBookingStatus(slug, status),
    onSuccess: () => {
      // Invalidamos todas las queries de bookings
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
