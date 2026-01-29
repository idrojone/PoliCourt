import type { BookingType } from "./Booking";

export interface CreateBookingDTO {
  courtSlug: string;
  organizerUsername: string;
  type: BookingType;
  title?: string;
  description?: string;
  startTime: string; // ISO date-time
  endTime: string; // ISO date-time
}
