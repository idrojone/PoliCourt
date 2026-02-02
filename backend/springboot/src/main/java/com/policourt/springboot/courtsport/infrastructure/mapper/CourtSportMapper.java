package com.policourt.springboot.courtsport.infrastructure.mapper;

import com.policourt.springboot.court.infrastructure.mapper.CourtMapper;
import com.policourt.springboot.courtsport.domain.model.CourtSport;
import com.policourt.springboot.courtsport.infrastructure.entity.CourtSportEntity;
import com.policourt.springboot.sport.infrastructure.mapper.SportMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Mapper encargado de la conversión entre el modelo de dominio CourtSport y la entidad de persistencia CourtSportEntity.
 */
@Component
@RequiredArgsConstructor
public class CourtSportMapper {

    private final CourtMapper courtMapper;
    private final SportMapper sportMapper;

    /**
     * Convierte un objeto de dominio CourtSport a su entidad de persistencia correspondiente.
     *
     * @param domain El objeto de dominio a convertir.
     * @return La entidad de persistencia o null si el dominio es nulo.
     */
    public CourtSportEntity toEntity(CourtSport domain) {
        if (domain == null) {
            return null;
        }

        CourtSportEntity entity = new CourtSportEntity();
        entity.setId(domain.getId());
        entity.setCourt(courtMapper.toEntity(domain.getCourt()));
        entity.setSport(sportMapper.toEntity(domain.getSport()));

        return entity;
    }

    /**
     * Convierte una entidad de persistencia CourtSportEntity al modelo de dominio CourtSport.
     *
     * @param entity La entidad de base de datos a convertir.
     * @return El objeto de dominio o null si la entidad es nula.
     */
    public CourtSport toDomain(CourtSportEntity entity) {
        if (entity == null) {
            return null;
        }

        return CourtSport.builder()
            .id(entity.getId())
            .sport(sportMapper.toDomain(entity.getSport()))
            .build();
    }
}
