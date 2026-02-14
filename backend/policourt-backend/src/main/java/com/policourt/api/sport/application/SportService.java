package com.policourt.api.sport.application;

import java.time.OffsetDateTime;
import java.util.Collection;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.github.slugify.Slugify;
import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.sport.domain.model.Sport;
import com.policourt.api.sport.domain.repository.SportRepository;
import org.springframework.data.domain.Sort;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import com.policourt.api.sport.domain.exception.SportAlreadyExistsException;
import com.policourt.api.sport.domain.exception.SportNotFoundException;

@Service
@RequiredArgsConstructor
public class SportService {
    private final SportRepository sportRepository;
    private final Slugify slugify;

    /**
     * Crea un nuevo deporte en el sistema.
     *
     * @param request El objeto Sport con la información del deporte a crear.
     * @return El deporte guardado en la base de datos.
     */
    @Transactional
    public Sport createSport(Sport request) {
        sportRepository.findByName(request.getName())
                .ifPresent(s -> { throw new SportAlreadyExistsException(request.getName()); });

        request.setSlug(slugify.slugify(request.getName()));
        request.setStatus(GeneralStatus.PUBLISHED);
        request.setActive(true);
        request.setCreatedAt(OffsetDateTime.now());
        request.setUpdatedAt(OffsetDateTime.now());

        return sportRepository.save(request);
    }

    /**
     * Busca deportes en el sistema.
     *
     * @param q
     * @param status
     * @param isActive
     * @param page
     * @param limit
     * @param sort
     * @return
     */
    public Page<Sport> searchSport(String q, Collection<GeneralStatus> status, Boolean isActive, int page, int limit,
            String sort) {

        Sort sortObj = switch (sort) {
            case "name_asc" -> Sort.by("name").ascending();
            case "name_desc" -> Sort.by("name").descending();
            case "createdAt_asc" -> Sort.by("createdAt").ascending();
            case "createdAt_desc" -> Sort.by("createdAt").descending();
            default -> Sort.by("name").ascending();
        };

        var pageable = PageRequest.of(Math.max(0, page - 1), limit, sortObj);
        return sportRepository.findByFilters(q, status, isActive, pageable);
    }

    /**
     * Actualiza un deporte
     * 
     * @param slug
     * @param request
     * @return
     */
    @Transactional
    public Sport updateSport(String slug, Sport request) {
        var sport = sportRepository.findBySlug(slug)
                .orElseThrow(() -> new SportNotFoundException(slug));

        if (!sport.getName().equals(request.getName())) {
            sportRepository.findByName(request.getName())
                    .ifPresent(s -> { throw new SportAlreadyExistsException(request.getName()); });

            sport.setName(request.getName());
            sport.setSlug(slugify.slugify(request.getName()));
        }

        if (request.getDescription() != null) {
            sport.setDescription(request.getDescription());
        }
        if (request.getImgUrl() != null) {
            sport.setImgUrl(request.getImgUrl());
        }

        sport.setUpdatedAt(OffsetDateTime.now());

        return sportRepository.save(sport);
    }

    /**
     * Actualiza el estado de un deporte
     * 
     * @param slug
     * @param status
     * @return
     */
    @Transactional
    public Sport updateStatus(String slug, GeneralStatus status) {
        var sport = sportRepository.findBySlug(slug)
                .orElseThrow(() -> new SportNotFoundException(slug));
        
        sport.setStatus(status);
        sport.setUpdatedAt(OffsetDateTime.now());
        return sportRepository.save(sport);
    }

    /**
     * Elimina un deporte
     * 
     * @param slug
     */
    @Transactional
    public void softDeleteSport(String slug) {
        var sport = sportRepository.findBySlug(slug)
                .orElseThrow(() -> new SportNotFoundException(slug));
        
        sport.setActive(false);
        sport.setUpdatedAt(OffsetDateTime.now());
        sportRepository.save(sport);
    }

    /**
     * Restaura un deporte eliminado
     * 
     * @param slug
     * @return
     */
    @Transactional
    public Sport restoreSport(String slug) {
        var sport = sportRepository.findBySlug(slug)
                .orElseThrow(() -> new SportNotFoundException(slug));
        
        sport.setActive(true);
        sport.setUpdatedAt(OffsetDateTime.now());
        return sportRepository.save(sport);
    }
}
