package com.policourt.api.sport.domain.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.sport.domain.model.Sport;

public interface SportRepository {
    Sport save(Sport sport);

    Page<Sport> findByFilters(String q, Collection<GeneralStatus> status, Boolean isActive, Pageable pageable);

    Optional<Sport> findBySlug(String slug);

    Optional<Sport> findByName(String name);

    List<Sport> findBySlugIn(Collection<String> slugs);
}