import type { UserRentalBooking } from "@/features/types/bookings/UserRentals";

export interface BookingCancellationResponse {
  booking: UserRentalBooking;
  refunded: boolean;
}
