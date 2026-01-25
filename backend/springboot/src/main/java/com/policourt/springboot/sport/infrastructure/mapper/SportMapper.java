package com.policourt.springboot.sport.infrastructure.mapper;

import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.infrastructure.entity.SportEntity;
import org.springframework.stereotype.Component;

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
            .createdAt(
                entity.getCreatedAt() != null
                    ? entity.getCreatedAt().atOffset(java.time.ZoneOffset.UTC)
                    : null
            )
            .updatedAt(
                entity.getUpdatedAt() != null
                    ? entity.getUpdatedAt().atOffset(java.time.ZoneOffset.UTC)
                    : null
            )
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
