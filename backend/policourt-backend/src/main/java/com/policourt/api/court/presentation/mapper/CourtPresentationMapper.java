package com.policourt.api.court.presentation.mapper;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import com.policourt.api.court.domain.model.Court;
import com.policourt.api.court.domain.model.CourtCriteria;
import com.policourt.api.court.presentation.request.CourtCreateRequest;
import com.policourt.api.court.presentation.response.CourtResponse;
import com.policourt.api.shared.response.PaginatedResponse;

import com.policourt.api.sport.presentation.mapper.SportPresentationMapper;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CourtPresentationMapper {

    private final SportPresentationMapper sportPresentationMapper;

    public Court toDomain(CourtCreateRequest request) {
        return Court.builder()
                .name(request.getName())
                .locationDetails(request.getLocationDetails())
                .imgUrl(request.getImgUrl())
                .priceH(request.getPriceH())
                .capacity(request.getCapacity())
                .isIndoor(request.getIsIndoor())
                .surface(request.getSurface())
                .sportSlugs(request.getSportSlugs())
                .build();
    }

    public Court toDomain(com.policourt.api.court.presentation.request.CourtUpdateRequest request) {
        return Court.builder()
                .name(request.getName())
                .locationDetails(request.getLocationDetails())
                .imgUrl(request.getImgUrl())
                .priceH(request.getPriceH())
                .capacity(request.getCapacity())
                .isIndoor(request.getIsIndoor())
                .surface(request.getSurface())
                .sportSlugs(request.getSportSlugs())
                .build();
    }

    public CourtCriteria toCriteria(
            com.policourt.api.court.presentation.request.CourtSearchRequest request) {
        return CourtCriteria.builder()
                .q(request.getQ())
                .name(request.getName())
                .locationDetails(request.getLocationDetails())
                .priceMin(request.getPriceMin())
                .priceMax(request.getPriceMax())
                .capacityMin(request.getCapacityMin())
                .capacityMax(request.getCapacityMax())
                .isIndoor(request.getIsIndoor())
                .surfaces(request.getSurfaces())
                .statuses(request.getStatuses())
                .sports(request.getSports())
                .isActive(request.getIsActive())
                .page(request.getPage())
                .limit(request.getLimit())
                .sort(request.getSort())
                .build();
    }

    public Court updateDomain(Court target, com.policourt.api.court.presentation.request.CourtUpdateRequest request) {
        target.setName(request.getName());
        target.setLocationDetails(request.getLocationDetails());
        target.setImgUrl(request.getImgUrl());
        target.setPriceH(request.getPriceH());
        target.setCapacity(request.getCapacity());
        target.setIsIndoor(request.getIsIndoor());
        target.setSurface(request.getSurface());
        target.setSportSlugs(request.getSportSlugs());
        return target;
    }

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
                court.getSports() != null ? court.getSports().stream()
                        .map(sportPresentationMapper::toPublicResponse)
                        .toList() : java.util.Collections.emptyList(),
                court.getStatus(),
                court.getIsActive());
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
