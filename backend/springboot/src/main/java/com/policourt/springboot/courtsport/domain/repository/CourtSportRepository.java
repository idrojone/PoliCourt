package com.policourt.springboot.courtsport.domain.repository;

import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.courtsport.domain.model.CourtSport;
import java.util.List;

public interface CourtSportRepository {
    CourtSport save(CourtSport courtSport);

    List<CourtSport> findByCourt(Court court);

    void delete(CourtSport courtSport);
}
