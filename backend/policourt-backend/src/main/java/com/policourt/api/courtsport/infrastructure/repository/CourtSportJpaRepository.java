package com.policourt.api.courtsport.infrastructure.repository;

import com.policourt.api.courtsport.infrastructure.entity.CourtSportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtSportJpaRepository extends JpaRepository<CourtSportEntity, Long> {
	boolean existsByCourt_IdAndSport_Id(Long courtId, Long sportId);
}
