import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClass } from "../service/booking.sp.service";
import type { Booking, CreateBookingDTO } from "@/features/types/booking";
import type { AxiosError } from "axios";

export const useCreateClassMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Booking, AxiosError<{ message: string }>, CreateBookingDTO>({
    mutationFn: (payload: CreateBookingDTO) => createClass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "classes"] });
    },
  });
};
