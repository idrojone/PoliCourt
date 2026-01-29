import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTournament } from "../service/booking.sp.service";
import type { Booking, CreateBookingDTO } from "@/features/types/booking";
import type { AxiosError } from "axios";

export const useCreateTournamentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Booking, AxiosError<{ message: string }>, CreateBookingDTO>({
    mutationFn: (payload: CreateBookingDTO) => createTournament(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "tournaments"] });
    },
  });
};
