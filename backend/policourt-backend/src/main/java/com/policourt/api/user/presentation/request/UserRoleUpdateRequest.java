package com.policourt.api.user.presentation.request;

import com.policourt.api.user.domain.enums.UserRole;
import jakarta.validation.constraints.NotNull;

public record UserRoleUpdateRequest(
        @NotNull(message = "El rol es obligatorio") UserRole role) {
}
