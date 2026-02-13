package com.policourt.api.sport.application;

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

@Service
@RequiredArgsConstructor
public class SportService {
    private final SportRepository sportRepository;
    private final Slugify slugify;

    @Transactional
    public Sport createSport(Sport request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("El nombre del deporte es obligatorio.");
        }

        request.setSlug(slugify.slugify(request.getName()));

        return sportRepository.save(request);
    }

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

}
