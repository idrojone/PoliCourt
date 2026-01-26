package com.policourt.springboot.court.infrastructure.addapter;

import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.court.domain.repository.CourtRepository;
import com.policourt.springboot.court.infrastructure.entity.CourtEntity;
import com.policourt.springboot.court.infrastructure.mapper.CourtMapper;
import com.policourt.springboot.court.infrastructure.repository.CourtJpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@SuppressWarnings("null")
@RequiredArgsConstructor
public class CourtRepositoryAdapter implements CourtRepository {

    private final CourtJpaRepository courtJpaRepository;
    private final CourtMapper courtMapper;

    @Override
    public Court save(Court court) {
        var entity = courtMapper.toEntity(court);
        var savedEntity = courtJpaRepository.save(entity);
        return courtMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Court> findById(UUID id) {
        return courtJpaRepository.findById(id).map(courtMapper::toDomain);
    }

    @Override
    public List<Court> findAll() {
        return courtJpaRepository
            .findAll()
            .stream()
            .map(courtMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        courtJpaRepository.deleteById(id);
    }

    @Override
    public void delete(Court court) {
        courtJpaRepository.delete(courtMapper.toEntity(court));
    }

    @Override
    public boolean existsBySlug(String slug) {
        return courtJpaRepository.existsBySlug(slug);
    }

    @Override
    public Optional<Court> findBySlug(String slug) {
        return courtJpaRepository.findBySlug(slug).map(courtMapper::toDomain);
    }

    @Override
    public Optional<CourtEntity> findEntityBySlug(String slug) {
        return courtJpaRepository.findBySlug(slug);
    }
}
