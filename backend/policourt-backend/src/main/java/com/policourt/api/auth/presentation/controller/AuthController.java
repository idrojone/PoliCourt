package com.policourt.api.auth.presentation.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.policourt.api.auth.application.AuthService;
import com.policourt.api.auth.domain.exception.UnauthorizedException;
import com.policourt.api.auth.presentation.mapper.AuthMapper;
import com.policourt.api.auth.presentation.request.LoginRequest;
import com.policourt.api.auth.presentation.request.RegisterRequest;
import com.policourt.api.auth.presentation.response.AuthResponse;
import com.policourt.api.auth.presentation.response.UserProfileResponse;
import com.policourt.api.shared.response.ApiResponse;
import com.policourt.api.shared.security.CustomUserDetails;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Autenticación", description = "Endpoints para registro, inicio de sesión y gestión de sesiones")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthMapper authMapper;

    @Value("${jwt.refresh-token.expiration-ms}")
    private long refreshTokenDurationMs;

    public static final String REFRESH_COOKIE_NAME = "policourt_refresh_token";

    @Operation(summary = "Obtener el perfil del usuario autenticado")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Perfil obtenido exitosamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Token ausente o inválido")
    })
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> me(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            throw new UnauthorizedException("Usuario no autenticado");
        }
        UserProfileResponse profile = authMapper.toUserProfile(userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.success(profile, "Perfil obtenido exitosamente"));
    }

    @Operation(summary = "Registrar un nuevo usuario")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Usuario registrado exitosamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "El email o nombre de usuario ya está en uso"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    })
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(ApiResponse.success(
                "Usuario registrado exitosamente. Por favor, inicia sesión.",
                "Registro exitoso"));
    }

    @Operation(summary = "Iniciar sesión y obtener tokens de acceso")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Autenticación exitosa"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            @RequestHeader(value = "User-Agent", required = false) String userAgent) {
        AuthResponse tokens = authService.login(request, userAgent);
        ResponseCookie cookie = generateCookie(tokens.getRefreshToken(), refreshTokenDurationMs / 1000);
        // No incluimos el refresh token en la respuesta JSON, solo lo enviamos como cookie
        tokens.setRefreshToken(null);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.success(tokens, "Autenticación exitosa"));
    }

    @Operation(summary = "Renovar access token mediante refresh token en cookie")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Token renovado exitosamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Refresh token ausente, revocado o inválido")
    })
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String refreshToken) {
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new UnauthorizedException("Refresh token ausente");
        }
        AuthResponse tokens = authService.refresh(refreshToken);
        ResponseCookie cookie = generateCookie(tokens.getRefreshToken(), refreshTokenDurationMs / 1000);
        tokens.setRefreshToken(null);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(ApiResponse.success(tokens, "Token renovado exitosamente"));
    }

    @Operation(summary = "Cerrar sesión y revocar el refresh token actual")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Sesión cerrada exitosamente")
    })
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            @CookieValue(name = REFRESH_COOKIE_NAME, required = false) String refreshToken) {
        if (refreshToken != null && refreshToken.contains(":")) {
            String familyIdStr = refreshToken.split(":")[0];
            authService.logout(familyIdStr);
        }
        ResponseCookie cleanCookie = generateCookie("", 0L);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
                .body(ApiResponse.success("Sesión cerrada exitosamente", "Logout exitoso"));
    }

    @Operation(summary = "Cerrar todas las sesiones activas del usuario autenticado")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Todas las sesiones cerradas exitosamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Usuario no autenticado")
    })
    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<String>> logoutAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails userDetails) {
            authService.logoutAll(userDetails.getUser().getId());
            ResponseCookie cleanCookie = generateCookie("", 0L);
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
                    .body(ApiResponse.success("Todas las sesiones han sido cerradas", "Logout global exitoso"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Usuario no autenticado"));
    }

    private ResponseCookie generateCookie(String token, long maxAgeSeconds) {
        return ResponseCookie.from(REFRESH_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(false) // Para producción, esto debería ser true y servir solo sobre HTTPS
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(maxAgeSeconds)
                .build();
    }
}
