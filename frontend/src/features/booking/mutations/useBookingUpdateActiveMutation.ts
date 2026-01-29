import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingActive } from "../service/booking.sp.service";
import type { Booking } from "@/features/types/booking";
import type { AxiosError } from "axios";

interface UpdateActiveParams {
  slug: string;
  isActive: boolean;
}

export const useBookingUpdateActiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Booking, AxiosError<{ message: string }>, UpdateActiveParams>({
    mutationFn: ({ slug, isActive }: UpdateActiveParams) =>
      updateBookingActive(slug, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};
