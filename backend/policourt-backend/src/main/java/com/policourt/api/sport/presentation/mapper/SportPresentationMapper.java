package com.policourt.api.sport.presentation.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.sport.domain.model.Sport;
import com.policourt.api.sport.presentation.request.SportRequest;
import com.policourt.api.sport.presentation.response.SportAdminResponse;
import com.policourt.api.shared.response.PaginatedResponse;
import org.springframework.data.domain.Page;

@Component
public class SportPresentationMapper {

    public Sport toDomain(SportRequest request) {
        return Sport.builder()
                .name(request.name())
                .description(request.description())
                .imgUrl(request.imgUrl())
                .status(request.status())
                .build();
    }

    public SportAdminResponse toResponse(Sport sport) {
        return new SportAdminResponse(
                sport.getName(),
                sport.getSlug(),
                sport.getDescription(),
                sport.getImgUrl(),
                sport.getStatus(),
                sport.isActive());
    }

    public PaginatedResponse<SportAdminResponse> toPaginatedResponse(Page<Sport> page) {
        return PaginatedResponse.<SportAdminResponse>builder()
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
