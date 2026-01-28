package com.policourt.springboot.sport.infrastructure.addapter;

import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.domain.repository.SportRepository;
import com.policourt.springboot.sport.infrastructure.entity.SportEntity;
import com.policourt.springboot.sport.infrastructure.mapper.SportMapper;
import com.policourt.springboot.sport.infrastructure.repository.SportJpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

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
    private final SportMapper sportMapper;

    @Override
    public Sport save(Sport sport) {
        SportEntity sportEntity;
        if (sport.getId() != null) {
            // Es una actualización, cargar la entidad existente
            sportEntity = sportJpaRepository
                .findById(sport.getId())
                .orElseThrow(() ->
                    new RuntimeException(
                        "Sport not found with id: " + sport.getId()
                    )
                );
            // Actualizar los campos de la entidad existente con los del dominio
            sportEntity.setSlug(sport.getSlug());
            sportEntity.setName(sport.getName());
            sportEntity.setDescription(sport.getDescription());
            sportEntity.setImgUrl(sport.getImgUrl());
            sportEntity.setStatus(sport.getStatus());
            sportEntity.setIsActive(sport.isActive());
        } else {
            // Es una creación nueva
            sportEntity = sportMapper.toEntity(sport);
        }

        SportEntity savedEntity = sportJpaRepository.save(sportEntity);
        return sportMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Sport> findById(UUID id) {
        return sportJpaRepository.findById(id).map(sportMapper::toDomain);
    }

    @Override
    public List<Sport> findAll() {
        return sportJpaRepository
            .findAll()
            .stream()
            .map(sportMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        sportJpaRepository.deleteById(id);
    }

    @Override
    public void delete(Sport sport) {
        sportJpaRepository.delete(sportMapper.toEntity(sport));
    }

    @Override
    public boolean existsBySlug(String slug) {
        return sportJpaRepository.existsBySlug(slug);
    }

    @Override
    public boolean existsByName(String name) {
        return sportJpaRepository.existsByName(name);
    }

    @Override
    public Optional<Sport> findBySlug(String slug) {
        return sportJpaRepository.findBySlug(slug).map(sportMapper::toDomain);
    }
}
