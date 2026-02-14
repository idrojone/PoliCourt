package com.policourt.api.courtsport.infrastructure.repository;

import java.util.UUID;


import com.policourt.api.courtsport.infrastructure.entity.CourtSportEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CourtSportJpaRepository extends JpaRepository<CourtSportEntity, UUID> {}
