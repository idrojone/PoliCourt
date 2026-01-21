package com.policourt.springboot.sport.infrastructure.mapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.infrastructure.entity.SportEntity;

@Component
public class SportMapper {

    public Sport toDomain(SportEntity entity) {
        if (entity == null) return null;
        
        return Sport.builder()
                .id(entity.getId())
                .slug(entity.getSlug())
                .name(entity.getName())
                .description(entity.getDescription())
                .imgUrl(entity.getImgUrl())
                .status(entity.getStatus())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt().atOffset(java.time.ZoneOffset.UTC))
                .updatedAt(entity.getUpdatedAt().atOffset(java.time.ZoneOffset.UTC))
                .build();
    }

    public SportEntity toEntity(Sport domain) {
        if (domain == null) return null;

        return SportEntity.builder()
                .id(domain.getId())
                .slug(domain.getSlug())
                .name(domain.getName())
                .description(domain.getDescription())
                .imgUrl(domain.getImgUrl())
                .status(domain.getStatus())
                .isActive(domain.isActive())
                .build();
    }
}