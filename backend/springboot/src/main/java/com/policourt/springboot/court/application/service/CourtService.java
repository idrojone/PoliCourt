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
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CourtService {

    private final CourtRepository courtRepository;
    private final SlugGenerator slugGenerator;
    private final CourtDtoMapper courtDtoMapper;
    private final SportRepository sportRepository;
    private final CourtSportRepository courtSportRepository;

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

        Court court = courtDtoMapper.toDomain(request);
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

        Court court = courtRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Pista no encontrada con slug: " + slug
                )
            );

        courtDtoMapper.updateDomainFromRequest(court, request);

        if (request.sports() != null) {
            // Eliminar deportes existentes
            courtSportRepository.deleteAllByCourtId(court.getId());

            // Agregar nuevos deportes
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
                    .court(court)
                    .sport(sport)
                    .build();
                courtSportRepository.save(courtSport);
            }
        }

        return courtRepository.save(court);
    }

    @Transactional
    public Court toggleSportActive(String slug) {
        var Court = courtRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Pista no encontrada con slug: " + slug
                )
            );
        Court.setActive(!Court.isActive());
        return courtRepository.save(Court);
    }

    public List<Court> getAllCourts() {
        return courtRepository.findAll();
    }

    @Transactional
    public Court updateCourtStatus(String slug, String status) {
        if (slug == null || slug.isBlank()) throw new IllegalArgumentException(
            "El slug es obligatorio para identificar la pista a actualizar."
        );

        if (
            status == null || status.isBlank()
        ) throw new IllegalArgumentException(
            "El estado es obligatorio para actualizar la pista."
        );

        var court = courtRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Pista no encontrada con slug: " + slug
                )
            );

        final CourtStatus newStatus;

        try {
            newStatus = CourtStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado no válido: " + status);
        }

        court.setStatus(newStatus);
        return courtRepository.save(court);
    }
}
