package com.policourt.api.court.infrastructure.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.policourt.api.court.infrastructure.entity.CourtEntity;

public interface CourtJpaRepository extends JpaRepository<CourtEntity, UUID>, JpaSpecificationExecutor<CourtEntity> {} 