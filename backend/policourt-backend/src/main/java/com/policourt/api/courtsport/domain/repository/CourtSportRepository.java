package com.policourt.api.courtsport.domain.repository;

import com.policourt.api.courtsport.domain.model.CourtSport;

public interface CourtSportRepository {
    CourtSport save(CourtSport courtSport);

    boolean existsByCourtIdAndSportId(Long courtId, Long sportId);
}
