package com.policourt.api.club.domain.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;

import com.policourt.api.club.domain.model.Club;
import com.policourt.api.club.domain.model.ClubCriteria;

public interface ClubRepository {
    Club save(Club club);

    Page<Club> findAll(ClubCriteria criteria);

    Optional<Club> findByName(String name);

    Optional<Club> findBySlug(String slug);
}
