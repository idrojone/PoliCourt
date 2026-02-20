package com.policourt.api.auth.presentation.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.policourt.api.auth.application.AuthService;
import com.policourt.api.auth.presentation.request.LoginRequest;
import com.policourt.api.auth.presentation.request.RegisterRequest;
import com.policourt.api.auth.presentation.response.AuthResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${jwt.refresh-token.expiration-ms}")
    private long refreshTokenDurationMs;

    private static final String REFRESH_COOKIE_NAME = "policourt_refresh_token";

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("Usuario registrado exitosamente. Por favor, inicia sesión.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String deviceId = "default-device"; // In a real app, parse User-Agent or custom header
        AuthResponse responseDto = authService.login(request, deviceId);

        ResponseCookie cookie = generateCookie(responseDto.getRefreshToken(), refreshTokenDurationMs / 1000);

        // Remove refreshToken from response body for security
        responseDto.setRefreshToken(null);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(responseDto);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            AuthResponse responseDto = authService.refresh(refreshToken);

            ResponseCookie newCookie = generateCookie(responseDto.getRefreshToken(), refreshTokenDurationMs / 1000);
            responseDto.setRefreshToken(null);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, newCookie.toString())
                    .body(responseDto);
        } catch (Exception e) {
            // Re-throw or return 401
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(name = REFRESH_COOKIE_NAME, required = false) String refreshToken) {
        if (refreshToken != null && refreshToken.contains(":")) {
            String familyIdStr = refreshToken.split(":")[0];
            authService.logout(familyIdStr);
        }

        ResponseCookie cleanCookie = generateCookie("", 0L);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
                .build();
    }

    @PostMapping("/logout-all")
    public ResponseEntity<Void> logoutAll() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof com.policourt.api.shared.security.CustomUserDetails) {
            com.policourt.api.shared.security.CustomUserDetails userDetails = (com.policourt.api.shared.security.CustomUserDetails) auth
                    .getPrincipal();
            authService.logoutAll(userDetails.getUser().getId());

            ResponseCookie cleanCookie = generateCookie("", 0L);
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
                    .build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    private ResponseCookie generateCookie(String token, long maxAgeSeconds) {
        return ResponseCookie.from(REFRESH_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(false) // Set to true for production HTTPS
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(maxAgeSeconds)
                .build();
    }
}
