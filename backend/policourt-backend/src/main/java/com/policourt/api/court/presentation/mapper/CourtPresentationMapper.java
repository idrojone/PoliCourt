package com.policourt.api.court.presentation.mapper;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import com.policourt.api.court.domain.model.Court;
import com.policourt.api.court.presentation.response.CourtResponse;
import com.policourt.api.shared.response.PaginatedResponse;

@Component
public class CourtPresentationMapper {

    public CourtResponse toResponse(Court court) {
        return new CourtResponse(
            court.getName(),
            court.getSlug(),
            court.getLocationDetails(),
            court.getImgUrl(),
            court.getPriceH(),
            court.getCapacity(),
            court.getIsIndoor(),
            court.getSurface(),
            court.getStatus(),
            court.getIsActive()
        );
    }

    public PaginatedResponse<CourtResponse> toPaginatedResponse(Page<Court> page) {
        return PaginatedResponse.<CourtResponse>builder()
            .content(page.getContent().stream().map(this::toResponse).toList())
            .page(page.getNumber() + 1)
            .limit(page.getSize())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .first(page.isFirst())
            .last(page.isLast())
            .build();
    }
}
