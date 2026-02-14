package com.policourt.api.courtsport.infrastructure.mapper;

import com.policourt.api.court.infrastructure.entity.CourtEntity;
import com.policourt.api.courtsport.domain.model.CourtSport;
import com.policourt.api.courtsport.infrastructure.entity.CourtSportEntity;
import com.policourt.api.sport.infrastructure.entity.SportEntity;

public class CourtSportMapper {

    public static CourtSportEntity toEntity(CourtSport domain) {
        
        CourtSportEntity entity = new CourtSportEntity();
        entity.setId(domain.getId());
        
        if (domain.getCourtId() != null) {
            CourtEntity court = new CourtEntity();
            court.setId(domain.getCourtId());
            entity.setCourt(court);
        }
        
        if (domain.getSportId() != null) {
            SportEntity sport = new SportEntity();
            sport.setId(domain.getSportId());
            entity.setSport(sport);
        }
        
        return entity;
    }
    

    public static CourtSport toDomain(CourtSportEntity entity) {
        CourtSport domain = new CourtSport();
        domain.setId(entity.getId());
        
        if (entity.getCourt() != null) {
            domain.setCourtId(entity.getCourt().getId());
        }
        
        if (entity.getSport() != null) {
            domain.setSportId(entity.getSport().getId());
        }
        
        return domain;
    }
}
