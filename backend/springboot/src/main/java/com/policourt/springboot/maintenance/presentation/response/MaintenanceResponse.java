package com.policourt.springboot.maintenance.presentation.response;

import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

/**
 * Response con los datos de un mantenimiento.
 */
@Schema(description = "Datos de un mantenimiento de pista")
public record MaintenanceResponse(
    @Schema(description = "Slug único del mantenimiento")
    String slug,

    @Schema(description = "Slug de la pista")
    String courtSlug,

    @Schema(description = "Nombre de la pista")
    String courtName,

    @Schema(description = "Username del creador")
    String createdByUsername,

    @Schema(description = "Título del mantenimiento")
    String title,

    @Schema(description = "Descripción del mantenimiento")
    String description,

    @Schema(description = "Fecha y hora de inicio")
    LocalDateTime startTime,

    @Schema(description = "Fecha y hora de fin")
    LocalDateTime endTime,

    @Schema(description = "Estado del mantenimiento")
    MaintenanceStatus status,

    @Schema(description = "Si el mantenimiento está activo")
    boolean isActive,

    @Schema(description = "Fecha de creación")
    LocalDateTime createdAt,

    @Schema(description = "Fecha de última actualización")
    LocalDateTime updatedAt
) {}
