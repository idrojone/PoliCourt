package com.policourt.api.user.presentation.response;

import java.time.OffsetDateTime;
import java.util.Date;

import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.user.domain.enums.UserRole;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos públicos del usuario")
public record UserResponse(
        @Schema(description = "Correo electrónico", example = "john.doe@example.com") String email,
        @Schema(description = "Nombre", example = "John") String firstName,
        @Schema(description = "Apellido", example = "Doe") String lastName,
        @Schema(description = "Teléfono", example = "+123456789") String phone,
        @Schema(description = "Fecha de nacimiento") Date dateOfBirth,
        @Schema(description = "Género", example = "MALE") String gender,
        @Schema(description = "URL del avatar", example = "https://example.com/avatar.jpg") String avatarUrl,
        @Schema(description = "Rol del usuario", example = "USER") UserRole role,
        @Schema(description = "Estado del usuario", example = "PUBLISHED") GeneralStatus status,
        @Schema(description = "Si el usuario está activo") Boolean isActive,
        @Schema(description = "Si el email está verificado") Boolean isEmailVerified,
        @Schema(description = "Fecha del último inicio de sesión") OffsetDateTime lastLoginAt,
        @Schema(description = "Fecha de creación") OffsetDateTime createdAt) {
}
