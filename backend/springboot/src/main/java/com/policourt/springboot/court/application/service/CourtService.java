package com.policourt.springboot.court.application.service;

import com.policourt.springboot.court.application.mapper.CourtDtoMapper;
import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.court.domain.repository.CourtRepository;
import com.policourt.springboot.court.infrastructure.entity.CourtEntity;
import com.policourt.springboot.court.infrastructure.mapper.CourtMapper;
import com.policourt.springboot.court.infrastructure.repository.CourtJpaRepository;
import com.policourt.springboot.court.presentation.request.CourtRequest;
import com.policourt.springboot.courtsport.domain.model.CourtSport;
import com.policourt.springboot.courtsport.domain.repository.CourtSportRepository;
import com.policourt.springboot.courtsport.infrastructure.entity.CourtSportEntity;
import com.policourt.springboot.shared.utils.SlugGenerator;
import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.domain.repository.SportRepository;
import com.policourt.springboot.sport.infrastructure.entity.SportEntity;
import com.policourt.springboot.sport.infrastructure.repository.SportJpaRepository;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CourtService {

    private final CourtRepository courtRepository;
    private final CourtJpaRepository courtJpaRepository;
    private final SportJpaRepository sportJpaRepository;
    private final SlugGenerator slugGenerator;
    private final CourtDtoMapper courtDtoMapper;
    private final CourtSportRepository courtSportRepository;
    private final SportRepository sportRepository;
    private final CourtMapper courtMapper;

    @Transactional
    public Court createCourt(CourtRequest request) {
        // Validaciones de campos obligatorios
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException(
                "El nombre de la pista es obligatorio."
            );
        }

        if (
            request.locationDetails() == null ||
            request.locationDetails().isBlank()
        ) {
            throw new IllegalArgumentException(
                "La ubicación de la pista es obligatoria."
            );
        }

        if (request.priceH() == null || request.priceH() <= 0) {
            throw new IllegalArgumentException(
                "El precio por hora es obligatorio y debe ser mayor a cero."
            );
        }
        if (request.capacity() == null || request.capacity() <= 0) {
            throw new IllegalArgumentException(
                "La capacidad es obligatoria y debe ser mayor a cero."
            );
        }
        if (request.isIndoor() == null) {
            throw new IllegalArgumentException(
                "El campo 'isIndoor' es obligatorio."
            );
        }
        if (request.surface() == null) {
            throw new IllegalArgumentException(
                "La superficie de la pista es obligatoria."
            );
        }

        String slug = slugGenerator.generate(request.name());

        if (courtRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException(
                "Ya existe una pista con el slug: " + slug
            );
        }

        Court court = courtDtoMapper.toDomain(request, slug);
        Court savedCourt = courtRepository.save(court);

        if (request.sports() != null && !request.sports().isEmpty()) {
            for (String sportSlug : request.sports()) {
                Sport sport = sportRepository
                    .findBySlug(sportSlug)
                    .orElseThrow(() ->
                        new IllegalArgumentException(
                            "El deporte con el slug: " +
                                sportSlug +
                                " no existe."
                        )
                    );

                CourtSport courtSport = CourtSport.builder()
                    .court(savedCourt)
                    .sport(sport)
                    .build();
                courtSportRepository.save(courtSport);
            }
        }

        return savedCourt;
    }

    @Transactional
    public Court updateCourt(String slug, CourtRequest request) {
        CourtEntity courtEntity = courtJpaRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Pista no encontrada con slug: " + slug
                )
            );

        courtDtoMapper.updateEntityFromRequest(courtEntity, request);

        if (request.sports() != null) {
            Set<String> requestedSportSlugs = Set.copyOf(request.sports());

            courtEntity
                .getSportAssignments()
                .removeIf(assignment ->
                    !requestedSportSlugs.contains(
                        assignment.getSport().getSlug()
                    )
                );

            Set<String> existingSportSlugs = courtEntity
                .getSportAssignments()
                .stream()
                .map(assignment -> assignment.getSport().getSlug())
                .collect(Collectors.toSet());

            requestedSportSlugs
                .stream()
                .filter(requestedSlug ->
                    !existingSportSlugs.contains(requestedSlug)
                )
                .forEach(slugToAdd -> {
                    SportEntity sportEntity = sportJpaRepository
                        .findBySlug(slugToAdd)
                        .orElseThrow(() ->
                            new IllegalArgumentException(
                                "Deporte no encontrado: " + slugToAdd
                            )
                        );
                    CourtSportEntity newAssignment = new CourtSportEntity();
                    newAssignment.setCourt(courtEntity);
                    newAssignment.setSport(sportEntity);
                    courtEntity.getSportAssignments().add(newAssignment);
                });
        }

        return courtMapper.toDomain(courtEntity);
    }

    @Transactional
    public Court toggleCourtActive(String slug) {
        var court = courtRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Pista no encontrada con slug: " + slug
                )
            );
        court.setActive(!court.isActive());

        return courtRepository.save(court);
    }

    public List<Court> getAllCourts() {
        return courtRepository.findAll();
    }

    @Transactional
    public Court updateCourtStatus(String slug, CourtStatus status) {
        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException(
                "El slug es obligatorio para identificar la pista a actualizar."
            );
        }

        if (status == null) {
            throw new IllegalArgumentException(
                "El estado es obligatorio para actualizar la pista."
            );
        }

        var court = courtRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Pista no encontrada con slug: " + slug
                )
            );

        court.setStatus(status);
        return courtRepository.save(court);
    }
}
