package com.policourt.api.sport.infrastructure.adapter;

import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.sport.domain.model.Sport;
import com.policourt.api.sport.domain.repository.SportRepository;
import com.policourt.api.sport.infrastructure.entity.SportEntity;
import com.policourt.api.sport.infrastructure.mapper.SportMapper;
import com.policourt.api.sport.infrastructure.repository.SportJpaRepository;
import com.policourt.api.sport.infrastructure.specifications.SportSpecifications;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class SportRepositoryAdapter implements SportRepository {
    private final SportJpaRepository sportJpaRepository;
    private final SportMapper sportMapper;

    @Override
    public Sport save(Sport sport) {
        SportEntity sportEntity;
        if (sport.getId() != null) {
            sportEntity = sportJpaRepository.findById(sport.getId())
                    .orElseThrow(() -> new RuntimeException("Deporte no encontrado"));
            sportEntity.setSlug(sport.getSlug());
            sportEntity.setName(sport.getName());
            sportEntity.setDescription(sport.getDescription());
            sportEntity.setImgUrl(sport.getImgUrl());
            sportEntity.setStatus(sport.getStatus());
            sportEntity.setIsActive(sport.isActive());
        } else {
            sportEntity = sportMapper.toEntity(sport);
        }
        SportEntity savedEntity = sportJpaRepository.save(sportEntity);
        return sportMapper.toDomain(savedEntity);
    }

    @Override
    public Page<Sport> findByFilters(String q, Collection<GeneralStatus> status, Boolean isActive, Pageable pageable) {
        var spec = SportSpecifications.buildEntity(q, status, isActive);
        var page = sportJpaRepository.findAll(spec, pageable);
        return page.map(sportMapper::toDomain);
    }

    @Override
    public Optional<Sport> findBySlug(String slug) {
        return Optional.ofNullable(sportJpaRepository.findBySlug(slug))
                .map(sportMapper::toDomain);
    }

    @Override
    public Optional<Sport> findByName(String name) {
        return Optional.ofNullable(sportJpaRepository.findByName(name))
                .map(sportMapper::toDomain);
    }

    @Override
    public List<Sport> findBySlugIn(Collection<String> slugs) {
        return sportJpaRepository.findBySlugIn(slugs).stream()
                .map(sportMapper::toDomain)
                .toList();
    }

    @Override
    public List<String> findAllSlugs() {
        return sportJpaRepository.findAllSlugs();
    }

}
