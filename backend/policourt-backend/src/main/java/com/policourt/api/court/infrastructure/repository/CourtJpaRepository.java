package com.policourt.api.court.infrastructure.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.policourt.api.court.infrastructure.entity.CourtEntity;

public interface CourtJpaRepository extends JpaRepository<CourtEntity, Long>, JpaSpecificationExecutor<CourtEntity> {
    Optional<CourtEntity> findByName(String name);

    Optional<CourtEntity> findBySlug(String slug);
}