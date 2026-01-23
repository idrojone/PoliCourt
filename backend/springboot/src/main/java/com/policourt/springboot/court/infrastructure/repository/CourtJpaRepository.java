package com.policourt.springboot.court.infrastructure.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.policourt.springboot.court.infrastructure.entity.CourtEntity;

public interface CourtJpaRepository extends JpaRepository<CourtEntity, UUID>{
    Optional<CourtEntity> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
