package com.policourt.api.court.domain.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;

import com.policourt.api.court.domain.model.Court;
import com.policourt.api.court.domain.model.CourtCriteria;

public interface CourtRepository {
    Court save(Court court);

    Page<Court> findAll(CourtCriteria criteria);

    Optional<Court> findByName(String name);

    Optional<Court> findBySlug(String slug);
}
