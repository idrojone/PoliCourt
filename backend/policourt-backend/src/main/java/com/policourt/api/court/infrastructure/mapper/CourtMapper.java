package com.policourt.api.court.infrastructure.mapper;

import com.policourt.api.court.domain.model.Court;
import com.policourt.api.court.infrastructure.entity.CourtEntity;
import com.policourt.api.sport.infrastructure.mapper.SportMapper;

import org.springframework.stereotype.Component;

import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CourtMapper {

    private final SportMapper sportMapper;

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
                .sports(entity.getCourtSports() != null
                        ? entity.getCourtSports().stream()
                                .filter(cs -> cs.getSport() != null)
                                .map(cs -> sportMapper.toDomain(cs.getSport()))
                                .collect(Collectors.toList())
                        : null)
                .sportSlugs(entity.getCourtSports() != null
                        ? entity.getCourtSports().stream()
                                .filter(cs -> cs.getSport() != null)
                                .map(cs -> cs.getSport().getSlug())
                                .collect(Collectors.toList())
                        : null)
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

    public void updateEntity(CourtEntity entity, Court court) {
        entity.setSlug(court.getSlug());
        entity.setName(court.getName());
        entity.setLocationDetails(court.getLocationDetails());
        entity.setImgUrl(court.getImgUrl());
        entity.setPriceH(court.getPriceH());
        entity.setCapacity(court.getCapacity());
        entity.setIsIndoor(court.getIsIndoor());
        entity.setSurface(court.getSurface());
        entity.setStatus(court.getStatus());
        entity.setIsActive(court.getIsActive());
    }
}
