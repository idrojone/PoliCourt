package com.policourt.springboot.court.domain.repository;

import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.court.infrastructure.entity.CourtEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourtRepository {
    Court save(Court court);
    Optional<Court> findById(UUID id);
    List<Court> findAll();
    void deleteById(UUID id);
    void delete(Court court);
    boolean existsBySlug(String slug);
    Optional<Court> findBySlug(String slug);
    Optional<CourtEntity> findEntityBySlug(String slug);
}
