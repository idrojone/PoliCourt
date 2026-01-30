/**
 * DTO para actualizar un mantenimiento existente.
 * Solo se pueden modificar: título, descripción y horarios.
 * NO se puede cambiar: pista, creador.
 */
export interface UpdateMaintenanceDTO {
  title?: string;
  description?: string;
  startTime: string; // ISO date-time sin timezone (LocalDateTime)
  endTime: string; // ISO date-time sin timezone (LocalDateTime)
}
