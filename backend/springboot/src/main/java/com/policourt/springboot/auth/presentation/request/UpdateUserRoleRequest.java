package com.policourt.springboot.auth.presentation.request;

import com.policourt.springboot.auth.domain.enums.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request to update a user's role.")
public record UpdateUserRoleRequest(
    @NotNull
    @Schema(description = "The new role for the user.", example = "ADMIN")
    UserRole role
) {}
