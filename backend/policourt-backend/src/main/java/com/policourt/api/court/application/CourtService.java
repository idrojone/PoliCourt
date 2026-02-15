package com.policourt.api.court.application;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.domain.Page;

import org.springframework.stereotype.Service;

import com.github.slugify.Slugify;
import com.policourt.api.court.domain.model.Court;
import com.policourt.api.court.domain.model.CourtCriteria;
import com.policourt.api.court.domain.repository.CourtRepository;
import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.sport.domain.model.Sport;
import com.policourt.api.sport.domain.repository.SportRepository;

import lombok.RequiredArgsConstructor;

import com.policourt.api.court.domain.exception.CourtAlreadyExistsException;
import com.policourt.api.court.domain.exception.CourtNotFoundException;
import com.policourt.api.court.domain.exception.SportsNotFoundException;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CourtService {

    private final CourtRepository courtRepository;
    private final SportRepository sportRepository;
    private final Slugify slugify;

    public Court createCourt(Court request) {
        courtRepository.findByName(request.getName())
                .ifPresent(c -> {
                    throw new CourtAlreadyExistsException(request.getName());
                });

        List<Sport> sports = sportRepository.findBySlugIn(request.getSportSlugs());
        if (sports.size() != request.getSportSlugs().size()) {
            List<String> foundSlugs = sports.stream().map(Sport::getSlug).toList();
            List<String> missingSlugs = request.getSportSlugs().stream()
                    .filter(slug -> !foundSlugs.contains(slug))
                    .toList();
            throw new SportsNotFoundException(missingSlugs);
        }

        request.setSlug(slugify.slugify(request.getName()));
        request.setStatus(GeneralStatus.PUBLISHED);
        request.setIsActive(true);
        request.setCreatedAt(OffsetDateTime.now());
        request.setUpdatedAt(OffsetDateTime.now());

        return courtRepository.save(request);
    }

    public Court updateCourt(String slug, Court request) {
        Court existingCourt = courtRepository.findBySlug(slug)
                .orElseThrow(() -> new CourtNotFoundException(slug));

        if (!existingCourt.getName().equals(request.getName())) {
            courtRepository.findByName(request.getName())
                    .ifPresent(c -> {
                        throw new CourtAlreadyExistsException(request.getName());
                    });
            existingCourt.setSlug(slugify.slugify(request.getName()));
        }

        List<String> sportSlugs = request.getSportSlugs();
        if (sportSlugs != null && !sportSlugs.isEmpty()) {
            List<Sport> sports = sportRepository.findBySlugIn(sportSlugs);
            if (sports.size() != sportSlugs.size()) {
                List<String> foundSlugs = sports.stream().map(Sport::getSlug).toList();
                List<String> missingSlugs = sportSlugs.stream()
                        .filter(s -> !foundSlugs.contains(s))
                        .toList();
                throw new SportsNotFoundException(missingSlugs);
            }
        }

        existingCourt.setName(request.getName());
        existingCourt.setLocationDetails(request.getLocationDetails());
        existingCourt.setImgUrl(request.getImgUrl());
        existingCourt.setPriceH(request.getPriceH());
        existingCourt.setCapacity(request.getCapacity());
        existingCourt.setIsIndoor(request.getIsIndoor());
        existingCourt.setSurface(request.getSurface());
        existingCourt.setSportSlugs(request.getSportSlugs());
        existingCourt.setUpdatedAt(OffsetDateTime.now());

        return courtRepository.save(existingCourt);
    }

    public void deleteCourt(String slug) {
        Court existingCourt = courtRepository.findBySlug(slug)
                .orElseThrow(() -> new CourtNotFoundException(slug));

        existingCourt.setIsActive(false);
        existingCourt.setUpdatedAt(OffsetDateTime.now());

        courtRepository.save(existingCourt);
    }

    public void restoreCourt(String slug) {
        Court existingCourt = courtRepository.findBySlug(slug)
                .orElseThrow(() -> new CourtNotFoundException(slug));

        existingCourt.setIsActive(true);
        existingCourt.setUpdatedAt(OffsetDateTime.now());

        courtRepository.save(existingCourt);
    }

    public Page<Court> getCourts(CourtCriteria criteria) {
        return courtRepository.findAll(criteria);
    }

    public Court changeStatus(String slug, GeneralStatus status) {
        Court existingCourt = courtRepository.findBySlug(slug)
                .orElseThrow(() -> new CourtNotFoundException(slug));

        existingCourt.setStatus(status);
        existingCourt.setUpdatedAt(OffsetDateTime.now());

        return courtRepository.save(existingCourt);
    }
}
