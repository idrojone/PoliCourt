import { useQuery } from "@tanstack/react-query";
import { getUserClassEnrollments } from "@/features/user/service/user.sp.service";
import type { BookingResponse } from "@/features/types/bookings/BookingRecord";

export const useUserClassEnrollmentsQuery = (username: string | undefined, enabled = false) => {
  return useQuery<BookingResponse[]>({
    queryKey: ["user-class-enrollments", username],
    queryFn: () => getUserClassEnrollments(username!),
    enabled: enabled && !!username,
  });
};
