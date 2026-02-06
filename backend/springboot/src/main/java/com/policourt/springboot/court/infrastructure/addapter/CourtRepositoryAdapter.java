package com.policourt.springboot.court.infrastructure.addapter;

import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.enums.CourtSurface;
import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.court.domain.repository.CourtRepository;
import com.policourt.springboot.court.infrastructure.mapper.CourtMapper;
import com.policourt.springboot.court.infrastructure.repository.CourtJpaRepository;
import com.policourt.springboot.court.infrastructure.specifications.CourtSpecifications;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
/**
 * Adaptador de infraestructura que implementa el contrato del repositorio de pistas.
 * Se encarga de la comunicación con la base de datos a través de JPA y la conversión entre
 * entidades de persistencia y modelos de dominio.
 */
@Repository
@SuppressWarnings("null")
@RequiredArgsConstructor
public class CourtRepositoryAdapter implements CourtRepository {

    private final CourtJpaRepository courtJpaRepository;
    private final CourtMapper courtMapper;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Court save(Court court) {
        var entity = courtMapper.toEntity(court);
        var savedEntity = courtJpaRepository.save(entity);
        return courtMapper.toDomain(savedEntity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Court> findById(UUID id) {
        return courtJpaRepository.findById(id).map(courtMapper::toDomain);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<Court> findAll() {
        return courtJpaRepository
            .findAll()
            .stream()
            .map(courtMapper::toDomain)
            .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void deleteById(UUID id) {
        courtJpaRepository.deleteById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void delete(Court court) {
        courtJpaRepository.delete(courtMapper.toEntity(court));
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public boolean existsBySlug(String slug) {
        return courtJpaRepository.existsBySlug(slug);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Court> findBySlug(String slug) {
        return courtJpaRepository.findBySlug(slug).map(courtMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Court> findAllByFilters(String q, String name, String locationDetails, BigDecimal price_h, Integer capacity, Boolean isIndoor, CourtSurface surface, CourtStatus status, Boolean isActive, Pageable pageable) {
        var spec = CourtSpecifications.buildEntity(q, name, locationDetails, price_h, capacity, isIndoor, surface, status, isActive);
        var page = courtJpaRepository.findAll(spec, pageable);
        return page.map(courtMapper::toDomain);
    }
}
