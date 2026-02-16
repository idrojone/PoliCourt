package com.policourt.api.user.presentation.request;

import java.sql.Date;

import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
        @Size(max = 100) String firstName,
        @Size(max = 100) String lastName,
        @Size(max = 20) String phone,
        Date dateOfBirth,
        @Size(max = 20) String gender,
        String avatarUrl,
        @Size(min = 6, max = 100) String password) {
}
