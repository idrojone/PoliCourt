package com.policourt.api.court.infrastructure.adapter;

import com.policourt.api.court.domain.model.Court;
import com.policourt.api.court.domain.model.CourtCriteria;
import com.policourt.api.court.domain.repository.CourtRepository;
import com.policourt.api.court.infrastructure.entity.CourtEntity;
import com.policourt.api.court.infrastructure.mapper.CourtMapper;
import com.policourt.api.court.infrastructure.repository.CourtJpaRepository;
import com.policourt.api.court.infrastructure.specifications.CourtSpecifications;
import com.policourt.api.courtsport.infrastructure.entity.CourtSportEntity;
import com.policourt.api.sport.infrastructure.repository.SportJpaRepository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CourtRepositoryAdapter implements CourtRepository {

    private final CourtJpaRepository courtJpaRepository;
    private final SportJpaRepository sportJpaRepository;
    private final CourtMapper courtMapper;

    @Override
    public Court save(Court court) {
        CourtEntity entity;

        if (court.getId() != null) {
            entity = courtJpaRepository.findById(court.getId())
                    .orElseGet(() -> courtMapper.toEntity(court));
            courtMapper.updateEntity(entity, court);
        } else {
            entity = courtMapper.toEntity(court);
        }

        if (court.getSportSlugs() != null) {
            var sports = sportJpaRepository.findBySlugIn(court.getSportSlugs());

            // Remove sports that are not in the new list
            entity.getCourtSports()
                    .removeIf(courtSport -> !court.getSportSlugs().contains(courtSport.getSport().getSlug()));

            // Add new sports
            for (var sport : sports) {
                boolean exists = entity.getCourtSports().stream()
                        .anyMatch(cs -> cs.getSport().getId().equals(sport.getId()));

                if (!exists) {
                    var courtSport = new CourtSportEntity();
                    courtSport.setCourt(entity);
                    courtSport.setSport(sport);
                    entity.getCourtSports().add(courtSport);
                }
            }
        }

        return courtMapper.toDomain(courtJpaRepository.save(entity));
    }

    @Override
    public Page<Court> findAll(CourtCriteria criteria) {
        var spec = CourtSpecifications.filteredByAtributosEntity(
                criteria.getName(),
                criteria.getLocationDetails(),
                criteria.getPriceMin(),
                criteria.getPriceMax(),
                criteria.getCapacityMin(),
                criteria.getCapacityMax(),
                criteria.getIsIndoor(),
                criteria.getSurfaces(),
                criteria.getStatuses(),
                criteria.getIsActive(),
                criteria.getSports());

        Pageable pageable = PageRequest.of(
                Math.max(0, criteria.getPage() - 1),
                criteria.getLimit(),
                mapSort(criteria.getSort()));

        return courtJpaRepository.findAll(spec, pageable).map(courtMapper::toDomain);
    }

    private Sort mapSort(String sortStr) {
        if (sortStr == null)
            return Sort.by("id").ascending();
        String[] parts = sortStr.split("_");
        if (parts.length != 2)
            return Sort.by("id").ascending();

        String field = parts[0];
        String direction = parts[1];

        var sort = Sort.by(field);
        return "desc".equalsIgnoreCase(direction) ? sort.descending() : sort.ascending();
    }

    @Override
    public Optional<Court> findByName(String name) {
        return courtJpaRepository.findByName(name).map(courtMapper::toDomain);
    }

    @Override
    public Optional<Court> findBySlug(String slug) {
        return courtJpaRepository.findBySlug(slug).map(courtMapper::toDomain);
    }
}
