package com.policourt.springboot.auth.infrastructure.mapper;

import com.policourt.springboot.auth.domain.model.User;
import com.policourt.springboot.auth.infrastructure.entity.UserEntity;
import org.springframework.stereotype.Component;

/**
 * Componente encargado de mapear datos entre el modelo de dominio {@link User}
 * y la entidad de persistencia {@link UserEntity}.
 * Facilita la conversión bidireccional necesaria para mantener la arquitectura limpia.
 */
@Component
public class UserMapper {

    /**
     * Convierte un modelo de dominio {@link User} a una entidad JPA {@link UserEntity}.
     *
     * @param user El modelo de usuario del dominio.
     * @return La entidad JPA correspondiente o null si la entrada es null.
     */
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

    /**
     * Convierte una entidad JPA {@link UserEntity} a un modelo de dominio {@link User}.
     *
     * @param entity La entidad de usuario recuperada de la base de datos.
     * @return El modelo de dominio correspondiente o null si la entrada es null.
     */
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
