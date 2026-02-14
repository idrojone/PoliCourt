package com.policourt.api.sport.infrastructure.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.policourt.api.sport.infrastructure.entity.SportEntity;

public interface SportJpaRepository extends JpaRepository<SportEntity, UUID>, JpaSpecificationExecutor<SportEntity> {
    SportEntity findBySlug(String slug);
    SportEntity findByName(String name);
}