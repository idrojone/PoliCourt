import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { updateClass } from "@/features/bookings/services/class.sp.service";
import type { BookingResponse } from "@/features/types/bookings/BookingRecord";
import type { BookingClassCreateRequest } from "@/features/types/bookings/BookingPayload";

export const useUpdateClassMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BookingResponse,
    AxiosError<{ message: string }> ,
    { uuid: string; payload: Partial<BookingClassCreateRequest> }
  >({
    mutationFn: ({ uuid, payload }) => updateClass(uuid, payload),
    onSuccess: (data) => {
      const org = (data && (data as any).organizer?.username) || undefined;
      if (org) {
        queryClient.invalidateQueries({ queryKey: ["classes", org] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["classes"] });
      }
    },
  });
};

export default useUpdateClassMutation;
