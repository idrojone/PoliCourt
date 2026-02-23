package com.policourt.api.auth.presentation.response;

import java.time.OffsetDateTime;

import com.policourt.api.user.domain.enums.UserRole;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Perfil del usuario autenticado")
public class UserProfileResponse {

    @Schema(description = "Nombre de usuario", example = "johndoe")
    private String username;

    @Schema(description = "Correo electrónico", example = "john@example.com")
    private String email;

    @Schema(description = "Nombre", example = "John")
    private String firstName;

    @Schema(description = "Apellido", example = "Doe")
    private String lastName;

    @Schema(description = "Teléfono", example = "+57 300 000 0000")
    private String phone;

    @Schema(description = "URL del avatar", example = "https://github.com/identicons/johndoe.png")
    private String avatarUrl;

    @Schema(description = "Rol del usuario", example = "USER")
    private UserRole role;

    @Schema(description = "Fecha de creación de la cuenta")
    private OffsetDateTime createdAt;
}
