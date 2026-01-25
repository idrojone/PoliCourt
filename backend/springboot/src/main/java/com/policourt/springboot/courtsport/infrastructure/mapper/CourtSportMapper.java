package com.policourt.springboot.courtsport.infrastructure.mapper;

import com.policourt.springboot.court.infrastructure.mapper.CourtMapper;
import com.policourt.springboot.courtsport.domain.model.CourtSport;
import com.policourt.springboot.courtsport.infrastructure.entity.CourtSportEntity;
import com.policourt.springboot.sport.infrastructure.mapper.SportMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CourtSportMapper {

    private final CourtMapper courtMapper;
    private final SportMapper sportMapper;

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
