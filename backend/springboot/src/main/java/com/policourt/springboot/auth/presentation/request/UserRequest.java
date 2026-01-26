package com.policourt.springboot.auth.presentation.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Request DTO for creating a new user.")
public record UserRequest(
    @Schema(
        description = "Unique username for the user.",
        example = "john.doe",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "Username cannot be blank.")
    @Size(
        min = 3,
        max = 50,
        message = "Username must be between 3 and 50 characters."
    )
    String username,

    @Schema(
        description = "Unique email for the user.",
        example = "john.doe@example.com",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "Email cannot be blank.")
    @Email(message = "Email should be valid.")
    String email,

    @Schema(
        description = "User's password. Will be hashed before storing.",
        example = "P@ssw0rd123!",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "Password cannot be blank.")
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    String password,

    @Schema(
        description = "User's first name.",
        example = "John",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "First name cannot be blank.")
    String firstName,

    @Schema(
        description = "User's last name.",
        example = "Doe",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "Last name cannot be blank.")
    String lastName,

    @Schema(
        description = "User's phone number.",
        example = "+1234567890",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    String phone
) {}
