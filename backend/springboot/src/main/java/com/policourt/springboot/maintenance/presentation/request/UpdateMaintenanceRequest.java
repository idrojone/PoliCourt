package com.policourt.springboot.maintenance.presentation.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * Request para actualizar un mantenimiento existente.
 * Solo se pueden modificar: título, descripción y horarios.
 * NO se puede cambiar: pista, creador.
 */
@Schema(description = "Datos para actualizar un mantenimiento")
public record UpdateMaintenanceRequest(
    @Schema(description = "Nuevo título del mantenimiento", example = "Reparación del césped - Actualizado")
    @Size(max = 150, message = "El título no puede exceder 150 caracteres")
    String title,

    @Schema(description = "Nueva descripción del mantenimiento")
    String description,

    @Schema(description = "Nueva fecha y hora de inicio", example = "2026-02-15T10:00:00")
    @NotNull(message = "La fecha de inicio es obligatoria")
    @Future(message = "La fecha de inicio debe ser en el futuro")
    LocalDateTime startTime,

    @Schema(description = "Nueva fecha y hora de fin", example = "2026-02-15T18:00:00")
    @NotNull(message = "La fecha de fin es obligatoria")
    @Future(message = "La fecha de fin debe ser en el futuro")
    LocalDateTime endTime
) {}
