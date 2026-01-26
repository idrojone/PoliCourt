package com.policourt.springboot.auth.presentation.request;

import com.policourt.springboot.auth.domain.enums.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request to update a user's status.")
public record UpdateUserStatusRequest(
    @NotNull
    @Schema(description = "The new status for the user.", example = "SUSPENDED")
    UserStatus status
) {}
