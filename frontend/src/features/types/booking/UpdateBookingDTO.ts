/**
 * DTO para actualizar reservas de tipo CLASS o TRAINING.
 * No se puede cambiar: courtSlug, organizerUsername, type.
 * Si cambia el título, se regenera el slug.
 */
export interface UpdateBookingDTO {
  title?: string;
  description?: string;
  startTime: string; // ISO date-time
  endTime: string; // ISO date-time
}
