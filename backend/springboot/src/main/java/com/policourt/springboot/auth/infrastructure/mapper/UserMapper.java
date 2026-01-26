package com.policourt.springboot.auth.infrastructure.mapper;

import com.policourt.springboot.auth.domain.model.User;
import com.policourt.springboot.auth.infrastructure.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserEntity toEntity(User user) {
        if (user == null) {
            return null;
        }
        return UserEntity.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .passwordHash(user.getPasswordHash())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .phone(user.getPhone())
            .imgUrl(user.getImgUrl())
            .role(user.getRole())
            .status(user.getStatus())
            .isActive(user.isActive())
            .build();
    }

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
            .imgUrl(entity.getImgUrl())
            .role(entity.getRole())
            .status(entity.getStatus())
            .isActive(entity.isActive())
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }
}
