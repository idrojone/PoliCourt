package com.policourt.springboot.court.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.policourt.springboot.court.domain.model.Court;

public interface CourtRepository {
    Court save(Court court);
    Optional<Court> findById(UUID id);
    Optional<Court> findBySlug(String slug);
    List<Court> findAll();
    // boolean existsByName(String name);
    void deleteById(UUID id);
    void delete(Court court);
    boolean existsBySlug(String slug);
}
