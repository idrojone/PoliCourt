package com.policourt.springboot.sport.application.mapper;

import org.springframework.stereotype.Component;

import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.domain.model.SportStatus;
import com.policourt.springboot.sport.presentation.request.SportRequest;

@Component
public class SportDtoMapper {

    public Sport toDomain(SportRequest request, String slug) {
        return Sport.builder()
                .name(request.name())
                .slug(slug)
                .description(request.description())
                .imgUrl(request.imgUrl())
                .status(SportStatus.PUBLISHED)
                .isActive(true)
                .build();
    }
}