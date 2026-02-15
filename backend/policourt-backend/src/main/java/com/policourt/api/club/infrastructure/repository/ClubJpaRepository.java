package com.policourt.api.club.infrastructure.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.policourt.api.club.infrastructure.entity.ClubEntity;

public interface ClubJpaRepository extends JpaRepository<ClubEntity, Long>, JpaSpecificationExecutor<ClubEntity> {
    Optional<ClubEntity> findByName(String name);

    Optional<ClubEntity> findBySlug(String slug);
}
