import { useQuery } from "@tanstack/react-query";
import { getTrainings } from "../service/booking.sp.service";

export const useTrainingsQuery = () => {
  return useQuery({
    queryKey: ["bookings", "trainings"],
    queryFn: () => getTrainings(),
  });
};
