package com.policourt.springboot.court.application.mapper;

import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.court.presentation.request.CourtRequest;
import com.policourt.springboot.courtsport.domain.model.CourtSport;
import com.policourt.springboot.sport.domain.model.Sport;
import org.springframework.stereotype.Component;

/**
 * Mapper encargado de la conversión entre DTOs de solicitud y el modelo de dominio Court.
 */
@Component
public class CourtDtoMapper {

    /**
     * Convierte una solicitud de creación/actualización en un objeto de dominio Court.
     *
     * @param request El DTO con los datos de la pista.
     * @param slug    El slug generado para la pista.
     * @return Un objeto de dominio {@link Court}.
     */
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

    /**
     * Actualiza una instancia existente del modelo de dominio con los datos de la solicitud.
     *
     * @param court   El objeto de dominio a actualizar.
     * @param request El DTO con los nuevos datos.
     */
    public void updateDomainFromRequest(Court court, CourtRequest request) {
        court.setName(request.name());
        court.setLocationDetails(request.locationDetails());
        court.setImgUrl(request.imgUrl());
        court.setPriceH(request.priceH());
        court.setCapacity(request.capacity());
        court.setSurface(request.surface());
        court.setIsIndoor(request.isIndoor());
    }

    /**
     * Crea una asociación entre una pista y un deporte.
     *
     * @param court La pista.
     * @param sport El deporte.
     * @return La entidad de asociación {@link CourtSport}.
     */
    public CourtSport toCourtSport(Court court, Sport sport) {
        return CourtSport.builder().court(court).sport(sport).build();
    }
}
