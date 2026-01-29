package com.policourt.springboot.maintenance.presentation.request;

import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/**
 * Request para actualizar el estado de un mantenimiento.
 */
@Schema(description = "Datos para actualizar el estado de un mantenimiento")
public record UpdateMaintenanceStatusRequest(
    @Schema(description = "Nuevo estado del mantenimiento", example = "IN_PROGRESS")
    @NotNull(message = "El estado es obligatorio")
    MaintenanceStatus status
) {}
