package com.policourt.springboot.maintenance.application.mapper;

import com.policourt.springboot.maintenance.domain.model.Maintenance;
import com.policourt.springboot.maintenance.presentation.response.MaintenanceResponse;
import org.springframework.stereotype.Component;

/**
 * Mapper entre Maintenance (dominio) y MaintenanceResponse (presentación).
 */
@Component
public class MaintenanceDtoMapper {

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
