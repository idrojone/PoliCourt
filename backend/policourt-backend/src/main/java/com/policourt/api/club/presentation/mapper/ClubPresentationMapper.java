package com.policourt.api.club.presentation.mapper;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import com.policourt.api.club.domain.model.Club;
import com.policourt.api.club.domain.model.ClubCriteria;
import com.policourt.api.club.presentation.request.ClubSearchRequest;
import com.policourt.api.club.presentation.response.ClubResponse;
import com.policourt.api.shared.response.PaginatedResponse;
import com.policourt.api.sport.presentation.mapper.SportPresentationMapper;

import lombok.RequiredArgsConstructor;

import com.policourt.api.club.presentation.request.ClubCreateRequest;
import com.policourt.api.club.presentation.request.ClubUpdateRequest;
import com.policourt.api.sport.domain.model.Sport;

@Component
@RequiredArgsConstructor
public class ClubPresentationMapper {

    private final SportPresentationMapper sportPresentationMapper;

    public Club toDomain(ClubCreateRequest request) {
        return Club.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imgUrl(request.getImgUrl())
                .sport(Sport.builder().slug(request.getSportSlug()).build())
                .build();
    }

    public Club toDomain(ClubUpdateRequest request) {
        return Club.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imgUrl(request.getImgUrl())
                .sport(request.getSportSlug() != null ? Sport.builder().slug(request.getSportSlug()).build() : null)
                .build();
    }

    public Club updateDomain(Club target, ClubUpdateRequest request) {
        target.setName(request.getName());
        target.setDescription(request.getDescription());
        target.setImgUrl(request.getImgUrl());
        return target;
    }

    public ClubCriteria toCriteria(ClubSearchRequest request) {
        return ClubCriteria.builder()
                .name(request.getName())
                .status(request.getStatus())
                .sports(request.getSports())
                .isActive(request.getIsActive())
                .page(request.getPage())
                .limit(request.getLimit())
                .sort(request.getSort())
                .build();
    }

    public ClubResponse toResponse(Club club) {
        return new ClubResponse(
                club.getName(),
                club.getSlug(),
                club.getDescription(),
                club.getImgUrl(),
                club.getSport() != null ? sportPresentationMapper.toPublicResponse(club.getSport()) : null,
                club.getStatus(),
                club.getIsActive());
    }

    public PaginatedResponse<ClubResponse> toPaginatedResponse(Page<Club> page) {
        return PaginatedResponse.<ClubResponse>builder()
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
