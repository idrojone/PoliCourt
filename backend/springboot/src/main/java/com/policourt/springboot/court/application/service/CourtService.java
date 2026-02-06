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

    /**
     * Crea una nueva pista deportiva en el sistema.
     * Valida los campos obligatorios, genera un slug único y asocia los deportes indicados.
     *
     * @param request DTO con la información de la pista y slugs de deportes.
     * @return La pista creada y persistida.
     * @throws IllegalArgumentException si faltan datos obligatorios o el slug ya existe.
     */
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

                CourtSport courtSport = courtDtoMapper.toCourtSport(savedCourt, sport);
                courtSportRepository.save(courtSport);
            }
        }

        return savedCourt;
    }

    /**
     * Actualiza los datos de una pista existente.
     * Permite modificar la información básica y sincronizar la lista de deportes asociados.
     *
     * @param slug    Identificador único de la pista a actualizar.
     * @param request DTO con los nuevos datos y la lista actualizada de deportes.
     * @return La pista con los cambios persistidos.
     * @throws IllegalArgumentException si la pista no existe o algún deporte no es válido.
     */
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

                    CourtSport newAssociation = courtDtoMapper.toCourtSport(court, sport);
                    courtSportRepository.save(newAssociation);
                });
        }

        return courtRepository.save(court);
    }

    /**
     * Alterna el estado de activación (borrado lógico) de una pista.
     *
     * @param slug Identificador único de la pista.
     * @return La pista con el estado 'isActive' invertido.
     * @throws IllegalArgumentException si la pista no existe.
     */
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

    /**
     * Recupera todas las pistas registradas en el sistema.
     *
     * @return Lista de objetos de dominio Court.
     */
    public List<Court> getAllCourts() {
        return courtRepository.findAll();
    }

    /**
     * Búsqueda paginada y filtrada de pistas usando Specifications.
     *
     * @param q Texto de búsqueda (LIKE sobre name y locationDetails)
     * @param name Filtro de nombre (LIKE)
     * @param locationDetails Filtro de ubicación (LIKE)
     * @param price_h Precio máximo
     * @param capacity Capacidad mínima
     * @param isIndoor Filtro interioridad
     * @param surface Superficie
     * @param status Estado
     * @param isActive Activo
     * @param page Página (1-based)
     * @param limit Tamaño de página
     * @param sort Clave de orden
     * @return Página de pistas
     */
    public org.springframework.data.domain.Page<Court> search(String q, String name, String locationDetails, java.math.BigDecimal priceMin, java.math.BigDecimal priceMax, Integer capacityMin, Integer capacityMax, Boolean isIndoor, java.util.Collection<com.policourt.springboot.court.domain.enums.CourtSurface> surfaces, java.util.Collection<com.policourt.springboot.court.domain.enums.CourtStatus> statuses, Boolean isActive, int page, int limit, String sort) {
        org.springframework.data.domain.Sort sortObj = switch (sort) {
            case "name_asc" -> org.springframework.data.domain.Sort.by("name").ascending();
            case "name_desc" -> org.springframework.data.domain.Sort.by("name").descending();
            case "price_desc" -> org.springframework.data.domain.Sort.by("priceH").descending();
            case "price_asc" -> org.springframework.data.domain.Sort.by("priceH").ascending();
            case "capacity_desc" -> org.springframework.data.domain.Sort.by("capacity").descending();
            case "capacity_asc" -> org.springframework.data.domain.Sort.by("capacity").ascending();
            case "created_at_desc" -> org.springframework.data.domain.Sort.by("createdAt").descending();
            case "created_at_asc" -> org.springframework.data.domain.Sort.by("createdAt").ascending();
            default -> org.springframework.data.domain.Sort.by("id").ascending();
        };
        var pageable = org.springframework.data.domain.PageRequest.of(Math.max(0, page - 1), limit, sortObj);
        return courtRepository.findAllByFilters(q, name, locationDetails, priceMin, priceMax, capacityMin, capacityMax, isIndoor, surfaces, statuses, isActive, pageable);
    }

    /**
     * Actualiza el estado de publicación de una pista.
     *
     * @param slug   Identificador único de la pista.
     * @param status Nuevo estado (PUBLISHED, DRAFT, etc.).
     * @return La pista con el nuevo estado actualizado.
     * @throws IllegalArgumentException si los parámetros son nulos o la pista no existe.
     */
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
