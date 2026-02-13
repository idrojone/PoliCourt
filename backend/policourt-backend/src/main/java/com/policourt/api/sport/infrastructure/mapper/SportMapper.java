package com.policourt.api.sport.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.sport.domain.model.Sport;
import com.policourt.api.sport.infrastructure.entity.SportEntity;

@Component
public class SportMapper {
    public Sport toDomain(SportEntity entity) {
        return Sport.builder()
                .id(entity.getId())
                .slug(entity.getSlug())
                .name(entity.getName())
                .description(entity.getDescription())
                .imgUrl(entity.getImgUrl())
                .status(entity.getStatus())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public SportEntity toEntity(Sport domain) {
        return SportEntity.builder()
                .id(domain.getId())
                .slug(domain.getSlug())
                .name(domain.getName())
                .description(domain.getDescription())
                .imgUrl(domain.getImgUrl())
                .status(domain.getStatus())
                .isActive(domain.isActive())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}
