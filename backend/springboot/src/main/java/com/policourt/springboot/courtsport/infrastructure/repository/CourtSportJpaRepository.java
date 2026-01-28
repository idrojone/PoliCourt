package com.policourt.springboot.courtsport.infrastructure.repository;

import com.policourt.springboot.court.infrastructure.entity.CourtEntity;
import com.policourt.springboot.courtsport.infrastructure.entity.CourtSportEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourtSportJpaRepository
    extends JpaRepository<CourtSportEntity, UUID>
{
    List<CourtSportEntity> findByCourt(CourtEntity court);
}
