/**
 * DTO específico para actualizar reservas de tipo RENTAL.
 * Solo se pueden modificar las horas, el precio se recalcula automáticamente.
 * No se puede cambiar: courtSlug, organizerUsername.
 */
export interface UpdateRentalDTO {
  startTime: string; // ISO date-time
  endTime: string; // ISO date-time
}
