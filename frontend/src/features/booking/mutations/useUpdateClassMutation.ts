import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClass } from "../service/booking.sp.service";
import type { Booking, UpdateBookingDTO } from "@/features/types/booking";
import type { AxiosError } from "axios";

interface UpdateClassParams {
  slug: string;
  payload: UpdateBookingDTO;
}

/**
 * Mutation para actualizar una CLASS.
 * Se pueden modificar: título, descripción, startTime, endTime.
 * Si cambia el título, se regenera el slug.
 */
export const useUpdateClassMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Booking, AxiosError<{ message: string }>, UpdateClassParams>({
    mutationFn: ({ slug, payload }) => updateClass(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "classes"] });
    },
  });
};
