package com.policourt.springboot.sport.infrastructure.addapter;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.domain.repository.SportRepository;
import com.policourt.springboot.sport.infrastructure.entity.SportEntity;
import com.policourt.springboot.sport.infrastructure.repository.SportJpaRepository;

import lombok.RequiredArgsConstructor;

/**
 * Adaptador de repositorio para la entidad Sport.
 * Implementa las operaciones CRUD utilizando SportJpaRepository.
 * 
 * @author Jordi Valls 
 * @version 1.0.0
 */
@Repository
@RequiredArgsConstructor
@SuppressWarnings("null")
public class SportRepositoryAdapter implements SportRepository {

    private final SportJpaRepository sportJpaRepository;

    @Override
    public Sport save(Sport sport) {
        SportEntity entity  = toEntity(sport);
        SportEntity savedEntity = sportJpaRepository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<Sport> findById(UUID id) {
        return sportJpaRepository.findById(id.toString()).map(this::toDomain);
    }

    @Override
    public List<Sport> findAll() {
        return sportJpaRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        sportJpaRepository.deleteById(id.toString());
    }

    @Override
    public void delete(Sport sport) {
        sportJpaRepository.delete(toEntity(sport));
    }

    @Override
    public boolean existsBySlug(String slug) {
        return sportJpaRepository.existsBySlug(slug);
    }
    
    @Override
    public Optional<Sport> findBySlug(String slug) {
        return sportJpaRepository.findBySlug(slug).map(this::toDomain);
    }

    private Sport toDomain(SportEntity entity) {
        return Sport.builder()
                .id(UUID.fromString(entity.getId()))
                .slug(entity.getSlug())
                .name(entity.getName())
                .description(entity.getDescription())
                .imgUrl(entity.getImgUrl())
                .status(entity.getStatus())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt().atOffset(java.time.ZoneOffset.UTC))
                .updatedAt(entity.getUpdatedAt().atOffset(java.time.ZoneOffset.UTC))
                .build();
    }

    private SportEntity toEntity(Sport domain) {
        return SportEntity.builder()
                .id(domain.getId() != null ? domain.getId().toString() : null)
                .slug(domain.getSlug())
                .name(domain.getName())
                .description(domain.getDescription())
                .imgUrl(domain.getImgUrl())
                .status(domain.getStatus())
                .isActive(domain.isActive())
                .build();
    }
    
}
