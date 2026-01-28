package com.policourt.springboot.court.application.service;

import com.policourt.springboot.court.application.mapper.CourtDtoMapper;
import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.court.domain.repository.CourtRepository;
import com.policourt.springboot.court.presentation.request.CourtRequest;
import com.policourt.springboot.courtsport.domain.model.CourtSport;
import com.policourt.springboot.courtsport.domain.repository.CourtSportRepository;
import com.policourt.springboot.shared.utils.SlugGenerator;
import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.domain.repository.SportRepository;
import java.math.BigDecimal;
import java.util.HashSet;
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
    private final SlugGenerator slugGenerator;
    private final CourtDtoMapper courtDtoMapper;
    private final CourtSportRepository courtSportRepository;
    private final SportRepository sportRepository;

    @Transactional
    public Court createCourt(CourtRequest request) {
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

        if (
            request.priceH() == null ||
            request.priceH().compareTo(BigDecimal.ZERO) <= 0
        ) {
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
        Court court = courtRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Pista no encontrada con slug: " + slug
                )
            );

        courtDtoMapper.updateDomainFromRequest(court, request);

        if (request.sports() != null) {
            Set<String> requestedSportSlugs = new HashSet<>(request.sports());

            // Obtener los deportes actualmente asociados
            List<CourtSport> currentSports = courtSportRepository.findByCourt(
                court
            );
            Set<String> existingSportSlugs = currentSports
                .stream()
                .map(cs -> cs.getSport().getSlug())
                .collect(Collectors.toSet());

            // Eliminar los que ya no están
            currentSports
                .stream()
                .filter(cs ->
                    !requestedSportSlugs.contains(cs.getSport().getSlug())
                )
                .forEach(courtSportRepository::delete);

            // Añadir los nuevos
            requestedSportSlugs
                .stream()
                .filter(sportSlug -> !existingSportSlugs.contains(sportSlug))
                .forEach(sportSlug -> {
                    Sport sport = sportRepository
                        .findBySlug(sportSlug)
                        .orElseThrow(() ->
                            new IllegalArgumentException(
                                "Deporte no encontrado: " + sportSlug
                            )
                        );

                    CourtSport newAssociation = CourtSport.builder()
                        .court(court)
                        .sport(sport)
                        .build();
                    courtSportRepository.save(newAssociation);
                });
        }

        return courtRepository.save(court);
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
