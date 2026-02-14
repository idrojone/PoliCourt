package com.policourt.api.court.infrastructure.mapper;

import com.policourt.api.court.domain.model.Court;
import com.policourt.api.court.infrastructure.entity.CourtEntity;

import org.springframework.stereotype.Component;

@Component
public class CourtMapper {
    
    public Court toDomain(CourtEntity entity) {
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
            .build();
    }

    public CourtEntity toEntity(Court court) {
        return CourtEntity.builder()
            .id(court.getId())
            .slug(court.getSlug())
            .name(court.getName())
            .locationDetails(court.getLocationDetails())
            .imgUrl(court.getImgUrl())
            .priceH(court.getPriceH())
            .capacity(court.getCapacity())
            .isIndoor(court.getIsIndoor())
            .surface(court.getSurface())
            .status(court.getStatus())
            .isActive(court.getIsActive())
            .build();
    }
}

