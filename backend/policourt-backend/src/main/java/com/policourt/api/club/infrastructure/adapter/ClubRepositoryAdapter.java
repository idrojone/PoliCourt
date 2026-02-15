package com.policourt.api.club.infrastructure.adapter;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import com.policourt.api.club.domain.model.Club;
import com.policourt.api.club.domain.model.ClubCriteria;
import com.policourt.api.club.domain.repository.ClubRepository;
import com.policourt.api.club.infrastructure.entity.ClubEntity;
import com.policourt.api.club.infrastructure.mapper.ClubMapper;
import com.policourt.api.club.infrastructure.repository.ClubJpaRepository;
import com.policourt.api.club.infrastructure.specifications.ClubSpecifications;
import com.policourt.api.sport.infrastructure.entity.SportEntity;
import com.policourt.api.sport.infrastructure.repository.SportJpaRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ClubRepositoryAdapter implements ClubRepository {

    private final ClubJpaRepository clubJpaRepository;
    private final SportJpaRepository sportJpaRepository;
    private final ClubMapper clubMapper;

    @Override
    public Club save(Club club) {
        ClubEntity entity;

        if (club.getId() != null) {
            entity = clubJpaRepository.findById(club.getId())
                    .orElseGet(() -> clubMapper.toEntity(club));
            clubMapper.updateEntity(entity, club);
        } else {
            entity = clubMapper.toEntity(club);
        }

        if (club.getSport() != null) {
            Long sportId = club.getSport().getId();
            SportEntity sport = sportJpaRepository.findById(sportId)
                    .orElseThrow(() -> new RuntimeException("Sport not found with id: " + sportId));
            entity.setSport(sport);
        }

        return clubMapper.toDomain(clubJpaRepository.save(entity));
    }

    @Override
    public Page<Club> findAll(ClubCriteria criteria) {
        var spec = ClubSpecifications.filteredByAttributes(
                criteria.getName(),
                criteria.getStatus(),
                criteria.getIsActive(),
                criteria.getSports());

        Pageable pageable = PageRequest.of(
                Math.max(0, criteria.getPage() - 1),
                criteria.getLimit(),
                mapSort(criteria.getSort()));

        return clubJpaRepository.findAll(spec, pageable).map(clubMapper::toDomain);
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
    public Optional<Club> findByName(String name) {
        return clubJpaRepository.findByName(name).map(clubMapper::toDomain);
    }

    @Override
    public Optional<Club> findBySlug(String slug) {
        return clubJpaRepository.findBySlug(slug).map(clubMapper::toDomain);
    }
}
