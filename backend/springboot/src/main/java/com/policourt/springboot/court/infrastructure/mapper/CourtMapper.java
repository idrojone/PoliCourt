package com.policourt.springboot.court.infrastructure.mapper;

import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.court.infrastructure.entity.CourtEntity;
import com.policourt.springboot.courtsport.infrastructure.mapper.CourtSportMapper;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class CourtMapper {

    private final CourtSportMapper courtSportMapper;

    public CourtMapper(@Lazy CourtSportMapper courtSportMapper) {
        this.courtSportMapper = courtSportMapper;
    }

    /**
     * Convierte una entidad de persistencia CourtEntity al modelo de dominio Court.
     *
     * @param entity La entidad de base de datos.
     * @return El objeto de dominio correspondiente o null si la entrada es null.
     */
    public Court toDomain(CourtEntity entity) {
        if (entity == null) return null;

        var sportCourts = entity
            .getSportAssignments()
            .stream()
            .map(courtSportMapper::toDomain)
            .collect(Collectors.toList());

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
            .sportCourts(sportCourts)
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

    /**
     * Convierte un objeto de dominio Court a una entidad de persistencia CourtEntity.
     *
     * @param domain El objeto de dominio.
     * @return La entidad de persistencia lista para ser guardada o null si la entrada es null.
     */
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
