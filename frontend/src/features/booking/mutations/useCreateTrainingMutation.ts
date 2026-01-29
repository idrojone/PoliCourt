import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTraining } from "../service/booking.sp.service";
import type { Booking, CreateBookingDTO } from "@/features/types/booking";
import type { AxiosError } from "axios";

export const useCreateTrainingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Booking, AxiosError<{ message: string }>, CreateBookingDTO>({
    mutationFn: (payload: CreateBookingDTO) => createTraining(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "trainings"] });
    },
  });
};
