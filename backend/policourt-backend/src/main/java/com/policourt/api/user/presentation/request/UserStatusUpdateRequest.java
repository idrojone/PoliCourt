package com.policourt.api.user.presentation.request;

import com.policourt.api.shared.enums.GeneralStatus;
import jakarta.validation.constraints.NotNull;

public record UserStatusUpdateRequest(
        @NotNull(message = "El estado es obligatorio") GeneralStatus status) {
}
