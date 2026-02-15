package com.policourt.api.club.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.club.domain.model.Club;
import com.policourt.api.club.infrastructure.entity.ClubEntity;
import com.policourt.api.sport.infrastructure.mapper.SportMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ClubMapper {

    private final SportMapper sportMapper;

    public Club toDomain(ClubEntity entity) {
        return Club.builder()
                .id(entity.getId())
                .slug(entity.getSlug())
                .name(entity.getName())
                .description(entity.getDescription())
                .imgUrl(entity.getImgUrl())
                .sport(entity.getSport() != null ? sportMapper.toDomain(entity.getSport()) : null)
                .status(entity.getStatus())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public ClubEntity toEntity(Club club) {
        return ClubEntity.builder()
                .id(club.getId())
                .slug(club.getSlug())
                .name(club.getName())
                .description(club.getDescription())
                .imgUrl(club.getImgUrl())
                .status(club.getStatus())
                .isActive(club.getIsActive())
                .build();
    }

    public void updateEntity(ClubEntity entity, Club club) {
        entity.setSlug(club.getSlug());
        entity.setName(club.getName());
        entity.setDescription(club.getDescription());
        entity.setImgUrl(club.getImgUrl());
        entity.setStatus(club.getStatus());
        entity.setIsActive(club.getIsActive());
    }
}
