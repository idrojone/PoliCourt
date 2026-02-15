package com.policourt.api.sport.infrastructure.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.policourt.api.sport.infrastructure.entity.SportEntity;

public interface SportJpaRepository extends JpaRepository<SportEntity, Long>, JpaSpecificationExecutor<SportEntity> {
    SportEntity findBySlug(String slug);

    SportEntity findByName(String name);

    List<SportEntity> findBySlugIn(Collection<String> slugs);

}