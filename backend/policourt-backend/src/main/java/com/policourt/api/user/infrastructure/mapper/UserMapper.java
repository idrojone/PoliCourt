package com.policourt.api.user.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.user.domain.model.User;
import com.policourt.api.user.infrastructure.entity.UserEntity;

@Component
public class UserMapper {

    public User toDomain(UserEntity entity) {
        if (entity == null) {
            return null;
        }
        return User.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .passwordHash(entity.getPasswordHash())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .phone(entity.getPhone())
                .dateOfBirth(entity.getDateOfBirth())
                .gender(entity.getGender())
                .avatarUrl(entity.getAvatarUrl())
                .role(entity.getRole())
                .status(entity.getStatus())
                .isActive(entity.getIsActive())
                .isEmailVerified(entity.getIsEmailVerified())
                .lastLoginAt(entity.getLastLoginAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public UserEntity toEntity(User domain) {
        if (domain == null) {
            return null;
        }
        return UserEntity.builder()
                .id(domain.getId())
                .username(domain.getUsername())
                .email(domain.getEmail())
                .passwordHash(domain.getPasswordHash())
                .firstName(domain.getFirstName())
                .lastName(domain.getLastName())
                .phone(domain.getPhone())
                .dateOfBirth(domain.getDateOfBirth())
                .gender(domain.getGender())
                .avatarUrl(domain.getAvatarUrl())
                // .role maps directly as UserRole is used in both
                .role(domain.getRole())
                .status(domain.getStatus())
                .isActive(domain.getIsActive())
                .isEmailVerified(domain.getIsEmailVerified())
                .lastLoginAt(domain.getLastLoginAt())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}
