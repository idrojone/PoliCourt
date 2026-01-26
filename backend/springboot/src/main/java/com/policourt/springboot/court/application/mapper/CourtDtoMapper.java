package com.policourt.springboot.court.application.mapper;

import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.court.infrastructure.entity.CourtEntity;
import com.policourt.springboot.court.presentation.request.CourtRequest;
import org.springframework.stereotype.Component;

@Component
public class CourtDtoMapper {

    public Court toDomain(CourtRequest request, String slug) {
        return Court.builder()
            .name(request.name())
            .slug(slug)
            .locationDetails(request.locationDetails())
            .imgUrl(request.imgUrl())
            .priceH(request.priceH())
            .capacity(request.capacity())
            .surface(request.surface())
            .isIndoor(request.isIndoor())
            .status(CourtStatus.PUBLISHED)
            .isActive(true)
            .build();
    }

    public void updateDomainFromRequest(Court court, CourtRequest request) {
        court.setName(request.name());
        court.setLocationDetails(request.locationDetails());
        court.setImgUrl(request.imgUrl());
        court.setPriceH(request.priceH());
        court.setCapacity(request.capacity());
        court.setSurface(request.surface());
        court.setIsIndoor(request.isIndoor());
    }

    public void updateEntityFromRequest(
        CourtEntity entity,
        CourtRequest request
    ) {
        entity.setName(request.name());
        entity.setLocationDetails(request.locationDetails());
        entity.setImgUrl(request.imgUrl());
        entity.setPriceH(request.priceH());
        entity.setCapacity(request.capacity());
        entity.setSurface(request.surface());
        entity.setIsIndoor(request.isIndoor());
    }
}
