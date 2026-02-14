package com.policourt.api.court.application;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.policourt.api.court.domain.enums.CourtSurfaceEnum;
import com.policourt.api.court.domain.model.Court;
import com.policourt.api.shared.enums.GeneralStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourtService {
    
    private final com.policourt.api.court.domain.repository.CourtRepository courtRepository;

    public Page<Court> getCourts(
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
        int page,
        int limit,
        String sort
    ) {

        Sort sortObj = switch (sort) {
            case "name_asc" -> Sort.by("name").ascending();
            case "name_desc" -> Sort.by("name").descending();
            case "price_desc" -> Sort.by("priceH").descending();
            case "price_asc" -> Sort.by("priceH").ascending();
            case "capacity_desc" -> Sort.by("capacity").descending();
            case "capacity_asc" -> Sort.by("capacity").ascending();
            case "created_at_desc" -> Sort.by("createdAt").descending();
            case "created_at_asc" -> Sort.by("createdAt").ascending();
            default -> Sort.by("id").ascending();
        };

        var pageable = PageRequest.of(Math.max(0, page - 1), limit, sortObj);

        return courtRepository.findAll(
            name,
            locationDetails,
            priceMin,
            priceMax,
            capacityMin,
            capacityMax,
            isIndoor,
            surfaces,
            statuses,
            isActive,
            sportSlugs,
            pageable
        );
    }
}
