package com.policourt.api.auth.presentation.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken; // Exists only in service, controller drops it from body and puts in cookie
    private String familyId;
    private String username;
    private String email;
    private String role;
}
