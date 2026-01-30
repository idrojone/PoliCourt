import type { BookingType } from "./Booking";

/**
 * DTO genérico para crear reservas de tipo CLASS o TRAINING.
 * Incluye title, description y type.
 */
export interface CreateBookingDTO {
  courtSlug: string;
  organizerUsername: string;
  type: BookingType;
  title?: string;
  description?: string;
  startTime: string; // ISO date-time
  endTime: string; // ISO date-time
}
