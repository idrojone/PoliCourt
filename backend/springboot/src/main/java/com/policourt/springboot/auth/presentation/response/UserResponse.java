package com.policourt.springboot.auth.presentation.response;

import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.domain.enums.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User details without sensitive information.")
public record UserResponse(
    @Schema(description = "Username", example = "john.doe") String username,

    @Schema(
        description = "User's email address",
        example = "john.doe@example.com"
    )
    String email,

    @Schema(description = "User's first name", example = "John")
    String firstName,

    @Schema(description = "User's last name", example = "Doe") String lastName,

    @Schema(description = "User's phone number", example = "+1234567890")
    String phone,

    @Schema(
        description = "URL of the user's profile image",
        example = "https://example.com/image.jpg"
    )
    String imgUrl,

    @Schema(description = "User's role", example = "USER") UserRole role,

    @Schema(description = "User's status", example = "PUBLISHED")
    UserStatus status,

    @Schema(description = "Indicates if the user is active", example = "true")
    boolean isActive
) {}
