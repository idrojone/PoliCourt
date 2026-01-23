package com.policourt.springboot.court.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.court.infrastructure.entity.CourtEntity;

@Component
public class CourtMapper {
    
    public Court toDomain(CourtEntity entity) {
        if (entity == null) return null;

        return Court.builder()
                .id(entity.getId())
                .slug(entity.getSlug())
                .name(entity.getName())
                .locationDetails(entity.getLocationDetails())
                .imgUrl(entity.getImgUrl())
                .priceH(entity.getPriceH())
                .capacity(entity.getCapacity())
                .isIndoor(entity.getIsIndoor())
                .surface(entity.getSurface())
                .status(entity.getStatus())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt().atOffset(java.time.ZoneOffset.UTC))
                .updatedAt(entity.getUpdatedAt().atOffset(java.time.ZoneOffset.UTC))
                .build();
    }

    public CourtEntity toEntity(Court domain) {
        if (domain == null) return null;

        return CourtEntity.builder()
                .id(domain.getId())
                .slug(domain.getSlug())
                .name(domain.getName())
                .locationDetails(domain.getLocationDetails())
                .imgUrl(domain.getImgUrl())
                .priceH(domain.getPriceH())
                .capacity(domain.getCapacity())
                .isIndoor(domain.getIsIndoor())
                .surface(domain.getSurface())
                .status(domain.getStatus())
                .isActive(domain.isActive())
                .build();
    }
}
