package com.policourt.springboot.courtsport.domain.repository;

import com.policourt.springboot.courtsport.domain.model.CourtSport;
import java.util.UUID;

public interface CourtSportRepository {
    CourtSport save(CourtSport courtSport);

    void deleteAllByCourtId(UUID courtId);
}
