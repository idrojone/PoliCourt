package com.policourt.springboot.maintenance.application.mapper;

import com.policourt.springboot.auth.domain.model.User;
import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.maintenance.domain.model.Maintenance;
import com.policourt.springboot.maintenance.presentation.request.CreateMaintenanceRequest;
import com.policourt.springboot.maintenance.presentation.response.MaintenanceResponse;
import org.springframework.stereotype.Component;


@Component
/**
 * Componente encargado de la transformación de datos entre la capa de dominio y la capa de presentación para la entidad Maintenance.
 */
public class MaintenanceDtoMapper {

    /**
     * Convierte un Request de creación a un objeto de Dominio Maintenance.
     *
     * @param request El DTO de entrada con los datos del mantenimiento.
     * @param court La entidad de la pista, ya buscada en el servicio.
     * @param createdBy El usuario que crea el mantenimiento, ya buscado en el servicio.
     * @return Un objeto de dominio {@link Maintenance} listo para ser procesado.
     */
    public Maintenance toDomain(CreateMaintenanceRequest request, Court court, User createdBy) {
        return Maintenance.builder()
            .court(court)
            .createdBy(createdBy)
            .title(request.title())
            .description(request.description())
            .startTime(request.startTime())
            .endTime(request.endTime())
            .status(request.status())
            .build();
    }


    /**
     * Convierte un objeto de dominio Maintenance a un DTO de respuesta MaintenanceResponse.
     *
     * @param maintenance El objeto de dominio a convertir.
     * @return Un {@link MaintenanceResponse} con los datos formateados para la capa de presentación,
     *         o null si la entrada es null.
     */
    public MaintenanceResponse toResponse(Maintenance maintenance) {
        if (maintenance == null) {
            return null;
        }

        return new MaintenanceResponse(
            maintenance.getSlug(),
            maintenance.getCourt() != null ? maintenance.getCourt().getSlug() : null,
            maintenance.getCourt() != null ? maintenance.getCourt().getName() : null,
            maintenance.getCreatedBy() != null ? maintenance.getCreatedBy().getUsername() : null,
            maintenance.getTitle(),
            maintenance.getDescription(),
            maintenance.getStartTime(),
            maintenance.getEndTime(),
            maintenance.getStatus(),
            maintenance.isActive(),
            maintenance.getCreatedAt(),
            maintenance.getUpdatedAt()
        );
    }
}
