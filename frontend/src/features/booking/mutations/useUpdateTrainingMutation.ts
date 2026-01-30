import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTraining } from "../service/booking.sp.service";
import type { Booking, UpdateBookingDTO } from "@/features/types/booking";
import type { AxiosError } from "axios";

interface UpdateTrainingParams {
  slug: string;
  payload: UpdateBookingDTO;
}

/**
 * Mutation para actualizar un TRAINING.
 * Se pueden modificar: título, descripción, startTime, endTime.
 * Si cambia el título, se regenera el slug.
 */
export const useUpdateTrainingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Booking, AxiosError<{ message: string }>, UpdateTrainingParams>({
    mutationFn: ({ slug, payload }) => updateTraining(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "trainings"] });
    },
  });
};
