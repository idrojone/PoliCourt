package com.policourt.api.club.application;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.policourt.api.club.domain.model.Club;
import com.policourt.api.club.domain.model.ClubCriteria;
import com.policourt.api.club.domain.repository.ClubRepository;

import lombok.RequiredArgsConstructor;

import com.github.slugify.Slugify;
import com.policourt.api.club.domain.exception.ClubAlreadyExistsException;
import com.policourt.api.club.domain.exception.ClubNotFoundException;
import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.sport.domain.model.Sport;
import com.policourt.api.sport.domain.repository.SportRepository;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class ClubService {

    private final ClubRepository clubRepository;
    private final SportRepository sportRepository;
    private final Slugify slugify;

    public Page<Club> getClubs(ClubCriteria criteria) {
        return clubRepository.findAll(criteria);
    }

    public Club createClub(Club club) {
        clubRepository.findByName(club.getName())
                .ifPresent(c -> {
                    throw new ClubAlreadyExistsException(club.getName());
                });

        if (club.getSport() != null && club.getSport().getSlug() != null) {
            Sport sport = sportRepository.findBySlug(club.getSport().getSlug())
                    .orElseThrow(() -> new RuntimeException("Deporte no encontrado: " + club.getSport().getSlug()));
            club.setSport(sport);
        } else {
            throw new RuntimeException("El deporte es requerido para un club");
        }

        club.setSlug(slugify.slugify(club.getName()));
        club.setStatus(GeneralStatus.PUBLISHED);
        club.setIsActive(true);
        club.setCreatedAt(OffsetDateTime.now());
        club.setUpdatedAt(OffsetDateTime.now());

        return clubRepository.save(club);
    }

    public Club updateClub(String slug, Club request) {
        Club existingClub = clubRepository.findBySlug(slug)
                .orElseThrow(() -> new ClubNotFoundException(slug));

        if (!existingClub.getName().equals(request.getName())) {
            clubRepository.findByName(request.getName())
                    .ifPresent(c -> {
                        throw new ClubAlreadyExistsException(request.getName());
                    });
            existingClub.setSlug(slugify.slugify(request.getName()));
        }

        if (request.getSport() != null && request.getSport().getSlug() != null) {
            Sport sport = sportRepository.findBySlug(request.getSport().getSlug())
                    .orElseThrow(() -> new RuntimeException("Deporte no encontrado: " + request.getSport().getSlug()));
            existingClub.setSport(sport);
        } else {
            throw new RuntimeException("El deporte es requerido para un club");
        }

        existingClub.setName(request.getName());
        existingClub.setDescription(request.getDescription());
        existingClub.setImgUrl(request.getImgUrl());
        existingClub.setUpdatedAt(OffsetDateTime.now());

        return clubRepository.save(existingClub);
    }

    public void deleteClub(String slug) {
        Club existingClub = clubRepository.findBySlug(slug)
                .orElseThrow(() -> new ClubNotFoundException(slug));

        existingClub.setIsActive(false);
        existingClub.setUpdatedAt(OffsetDateTime.now());

        clubRepository.save(existingClub);
    }

    public void restoreClub(String slug) {
        Club existingClub = clubRepository.findBySlug(slug)
                .orElseThrow(() -> new ClubNotFoundException(slug));

        existingClub.setIsActive(true);
        existingClub.setUpdatedAt(OffsetDateTime.now());

        clubRepository.save(existingClub);
    }

    public Club changeStatus(String slug, GeneralStatus status) {
        Club existingClub = clubRepository.findBySlug(slug)
                .orElseThrow(() -> new ClubNotFoundException(slug));

        existingClub.setStatus(status);
        existingClub.setUpdatedAt(OffsetDateTime.now());

        return clubRepository.save(existingClub);
    }
}
