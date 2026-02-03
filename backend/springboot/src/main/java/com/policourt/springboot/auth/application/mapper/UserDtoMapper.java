package com.policourt.springboot.auth.application.mapper;

import com.policourt.springboot.auth.domain.model.User;
import com.policourt.springboot.auth.presentation.request.UserRequest;
import com.policourt.springboot.auth.presentation.response.UserResponse;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre objetos de transferencia de datos (DTO) y el modelo de dominio User.
 */
@Component
public class UserDtoMapper {

    /**
     * Convierte una petición de usuario al modelo de dominio.
     *
     * @param request La petición de usuario.
     * @return El modelo de dominio User o null si la petición es nula.
     */
    public User toDomain(UserRequest request) {
        if (request == null) {
            return null;
        }

        return User.builder()
            .username(request.username())
            .email(request.email())
            .firstName(request.firstName())
            .lastName(request.lastName())
            .phone(request.phone())
            .build();
    }

    /**
     * Convierte un modelo de dominio User a una respuesta de usuario.
     *
     * @param user El modelo de dominio User.
     * @return La respuesta de usuario o null si el usuario es nulo.
     */
    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return new UserResponse(
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            user.getImgUrl(),
            user.getRole(),
            user.getStatus(),
            user.isActive()
        );
    }

    /**
     * Convierte una lista de modelos de dominio User a una lista de respuestas de usuario.
     *
     * @param users Lista de usuarios de dominio.
     * @return Lista de respuestas de usuario.
     */
    public List<UserResponse> toResponseList(List<User> users) {
        return users
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }
}
