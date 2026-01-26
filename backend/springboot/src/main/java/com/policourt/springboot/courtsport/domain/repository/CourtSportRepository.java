package com.policourt.springboot.courtsport.domain.repository;

import com.policourt.springboot.courtsport.domain.model.CourtSport;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface CourtSportRepository {
    CourtSport save(CourtSport courtSport);
    List<CourtSport> findAllByCourtId(UUID courtId);
    void deleteAllByCourtId(UUID courtId);
    void deleteAllByCourtIdAndSportSlugIn(UUID courtId, Set<String> slugs);
}
