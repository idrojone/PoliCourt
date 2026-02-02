package com.policourt.springboot.maintenance.presentation.request;

import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * Request para crear un nuevo mantenimiento de pista.
 */
@Schema(description = "Datos para programar un mantenimiento de pista")
public record CreateMaintenanceRequest(
    @Schema(description = "Slug de la pista", example = "pista-central-1")
    @NotBlank(message = "El slug de la pista es obligatorio")
    String courtSlug,

    @Schema(description = "Username del usuario que programa el mantenimiento", example = "admin")
    @NotBlank(message = "El username del creador es obligatorio")
    String createdByUsername,

    @Schema(description = "Título del mantenimiento", example = "Reparación del césped")
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 150, message = "El título no puede exceder 150 caracteres")
    String title,

    @Schema(description = "Descripción detallada del mantenimiento", example = "Se realizará el cambio del césped sintético")
    String description,

    @Schema(description = "Fecha y hora de inicio del mantenimiento", example = "2026-02-15T10:00:00")
    @NotNull(message = "La fecha de inicio es obligatoria")
    @Future(message = "La fecha de inicio debe ser en el futuro")
    LocalDateTime startTime,

    @Schema(description = "Fecha y hora de fin del mantenimiento", example = "2026-02-15T18:00:00")
    @NotNull(message = "La fecha de fin es obligatoria")
    @Future(message = "La fecha de fin debe ser en el futuro")
    LocalDateTime endTime,

    @Schema(description = "Estado inicial del mantenimiento", defaultValue = "SCHEDULED")
    MaintenanceStatus status
) {
    public CreateMaintenanceRequest {
        if (status == null) {
            status = MaintenanceStatus.SCHEDULED;
        }
    }
}
