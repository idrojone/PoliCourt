package com.policourt.api.court.domain.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.policourt.api.court.domain.enums.CourtSurfaceEnum;
import com.policourt.api.court.domain.model.Court;
import com.policourt.api.shared.enums.GeneralStatus;

public interface CourtRepository {
    Court save(Court court);
    
    Page<Court> findAll(
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
    );
}
