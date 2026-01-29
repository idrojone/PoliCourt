package com.policourt.springboot.maintenance.infrastructure.mapper;

import com.policourt.springboot.auth.infrastructure.mapper.UserMapper;
import com.policourt.springboot.court.infrastructure.mapper.CourtMapper;
import com.policourt.springboot.maintenance.domain.model.Maintenance;
import com.policourt.springboot.maintenance.infrastructure.entity.MaintenanceEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Mapper entre MaintenanceEntity (infraestructura) y Maintenance (dominio).
 */
@Component
@RequiredArgsConstructor
public class MaintenanceEntityMapper {

    private final CourtMapper courtMapper;
    private final UserMapper userMapper;

    public Maintenance toDomain(MaintenanceEntity entity) {
        if (entity == null) {
            return null;
        }

        return Maintenance.builder()
            .id(entity.getId())
            .slug(entity.getSlug())
            .court(courtMapper.toDomain(entity.getCourt()))
            .createdBy(userMapper.toDomain(entity.getCreatedBy()))
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

    public MaintenanceEntity toEntity(Maintenance domain) {
        if (domain == null) {
            return null;
        }

        return MaintenanceEntity.builder()
            .id(domain.getId())
            .slug(domain.getSlug())
            .court(courtMapper.toEntity(domain.getCourt()))
            .createdBy(userMapper.toEntity(domain.getCreatedBy()))
            .title(domain.getTitle())
            .description(domain.getDescription())
            .startTime(domain.getStartTime())
            .endTime(domain.getEndTime())
            .status(domain.getStatus())
            .isActive(domain.isActive())
            .createdAt(domain.getCreatedAt())
            .updatedAt(domain.getUpdatedAt())
            .build();
    }
}
