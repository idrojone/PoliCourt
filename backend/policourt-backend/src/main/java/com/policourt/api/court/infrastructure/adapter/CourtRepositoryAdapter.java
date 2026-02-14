package com.policourt.api.court.infrastructure.adapter;

import com.policourt.api.court.domain.enums.CourtSurfaceEnum;
import com.policourt.api.court.domain.model.Court;
import com.policourt.api.court.domain.repository.CourtRepository;
import com.policourt.api.court.infrastructure.mapper.CourtMapper;
import com.policourt.api.court.infrastructure.repository.CourtJpaRepository;
import com.policourt.api.shared.enums.GeneralStatus;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CourtRepositoryAdapter implements CourtRepository{
    
    private final CourtJpaRepository courtJpaRepository;
    private final CourtMapper courtMapper;

    @Override
    public Court save(Court court) {
        return courtMapper.toDomain(courtJpaRepository.save(courtMapper.toEntity(court)));
    }

    @Override
    public Page<Court> findAll(
        String name,
        String locationDetails,
        BigDecimal priceMin,
        BigDecimal priceMax,
        Integer capacityMin,
        Integer capacityMax,
        Boolean isIndoor,
        List<CourtSurfaceEnum> surfaces,
        List<GeneralStatus> statuses,
        Boolean isActive,
        List<String> sportSlugs,
        Pageable pageable
    ) {
        var spec = com.policourt.api.court.infrastructure.specifications.CourtSpecifications.filteredByAtributosEntity(
            name, locationDetails, priceMin, priceMax, capacityMin, capacityMax, isIndoor, surfaces, statuses, isActive, sportSlugs
        );
        return courtJpaRepository.findAll(spec, pageable).map(courtMapper::toDomain);
    }
}

