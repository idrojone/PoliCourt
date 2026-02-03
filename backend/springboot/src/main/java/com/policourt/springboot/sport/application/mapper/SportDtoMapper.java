package com.policourt.springboot.sport.application.mapper;

import org.springframework.stereotype.Component;

import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.domain.model.SportStatus;
import com.policourt.springboot.sport.presentation.request.SportRequest;

/**
 * Componente encargado de mapear los objetos de transferencia de datos (DTO)
 * a modelos de dominio para la entidad Sport.
 */
@Component
public class SportDtoMapper {

    /**
     * Convierte una solicitud de creación de deporte (DTO) a un modelo de dominio.
     * Establece el estado inicial como PUBLISHED y activo por defecto.
     *
     * @param request El DTO con los datos del deporte.
     * @param slug    El slug generado para el deporte.
     * @return El modelo de dominio {@link Sport} construido.
     */
    public Sport toDomain(SportRequest request, String slug) {
        return Sport.builder()
                .name(request.name())
                .slug(slug)
                .description(request.description())
                .imgUrl(request.imgUrl())
                .status(SportStatus.PUBLISHED)
                .isActive(true)
                .build();
    }
}