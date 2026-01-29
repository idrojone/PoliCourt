package com.policourt.springboot.maintenance.domain.model;

/**
 * Estado del mantenimiento programado.
 * Refleja el ENUM 'maintenance_status_enum' de la base de datos.
 */
public enum MaintenanceStatus {
    SCHEDULED,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED
}
