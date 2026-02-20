package com.policourt.api.auth.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.auth.domain.model.RefreshSession;
import com.policourt.api.auth.infrastructure.entity.RefreshSessionEntity;
import com.policourt.api.user.infrastructure.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RefreshSessionMapper {

    private final UserMapper userMapper;

    public RefreshSession toDomain(RefreshSessionEntity entity) {
        if (entity == null) {
            return null;
        }
        return RefreshSession.builder()
                .id(entity.getId())
                .user(userMapper.toDomain(entity.getUser()))
                .deviceId(entity.getDeviceId())
                .familyId(entity.getFamilyId())
                .currentTokenHash(entity.getCurrentTokenHash())
                .revoked(entity.getRevoked())
                .sessionVersion(entity.getSessionVersion())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public RefreshSessionEntity toEntity(RefreshSession domain) {
        if (domain == null) {
            return null;
        }
        return RefreshSessionEntity.builder()
                .id(domain.getId())
                .user(userMapper.toEntity(domain.getUser()))
                .deviceId(domain.getDeviceId())
                .familyId(domain.getFamilyId())
                .currentTokenHash(domain.getCurrentTokenHash())
                .revoked(domain.getRevoked() != null ? domain.getRevoked() : false)
                .sessionVersion(domain.getSessionVersion())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}
