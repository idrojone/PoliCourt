/**
 * DTO específico para crear reservas de tipo RENTAL.
 * No requiere title, description ni type (se genera automáticamente en el backend).
 */
export interface CreateRentalDTO {
  courtSlug: string;
  organizerUsername: string;
  startTime: string; // ISO date-time
  endTime: string; // ISO date-time
}
