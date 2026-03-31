package com.policourt.api.maintenance.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.court.domain.model.Court;
import com.policourt.api.maintenance.domain.model.CourtMaintenance;
import com.policourt.api.maintenance.infrastructure.entity.CourtMaintenanceEntity;
import com.policourt.api.user.domain.model.User;

@Component
public class CourtMaintenanceMapper {

    public CourtMaintenance toDomain(CourtMaintenanceEntity entity) {
        if (entity == null) {
            return null;
        }
        return CourtMaintenance.builder()
                .id(entity.getId())
                .uuid(entity.getUuid())
            .court(Court.builder()
                .id(entity.getCourt().getId())
                .slug(entity.getCourt().getSlug())
                .name(entity.getCourt().getName())
                .build())
                .createdBy(User.builder().id(entity.getCreatedBy().getId()).build())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .status(entity.getStatus())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public CourtMaintenanceEntity toEntity(CourtMaintenance maintenance) {
        if (maintenance == null) {
            return null;
        }
        return CourtMaintenanceEntity.builder()
                .id(maintenance.getId())
                .uuid(maintenance.getUuid())
                .title(maintenance.getTitle())
                .description(maintenance.getDescription())
                .startTime(maintenance.getStartTime())
                .endTime(maintenance.getEndTime())
                .status(maintenance.getStatus())
                .isActive(maintenance.getIsActive())
                .build();
    }

    public void updateEntity(CourtMaintenanceEntity entity, CourtMaintenance maintenance) {
        entity.setTitle(maintenance.getTitle());
        entity.setDescription(maintenance.getDescription());
        entity.setStartTime(maintenance.getStartTime());
        entity.setEndTime(maintenance.getEndTime());
        entity.setStatus(maintenance.getStatus());
        entity.setIsActive(maintenance.getIsActive());
    }
}
