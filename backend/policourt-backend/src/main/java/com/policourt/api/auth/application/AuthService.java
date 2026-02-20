package com.policourt.api.auth.application;

import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.policourt.api.auth.domain.exception.TokenRefreshException;
import com.policourt.api.auth.domain.model.RefreshSession;
import com.policourt.api.auth.domain.repository.RefreshSessionRepository;
import com.policourt.api.auth.presentation.request.LoginRequest;
import com.policourt.api.auth.presentation.request.RegisterRequest;
import com.policourt.api.auth.presentation.response.AuthResponse;
import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.user.domain.enums.UserRole;
import com.policourt.api.user.domain.model.User;
import com.policourt.api.user.domain.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshSessionRepository refreshSessionRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está en uso");
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }

        String githubAvatarUrl = "https://github.com/identicons/" + request.getUsername() + ".png";

        User newUser = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .avatarUrl(githubAvatarUrl)
                .role(UserRole.USER)
                .status(GeneralStatus.PUBLISHED)
                .isActive(true)
                .isEmailVerified(false)
                .sessionVersion(0)
                .build();

        userRepository.save(newUser);
    }

    @Transactional
    public AuthResponse login(LoginRequest request, String deviceId) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (AuthenticationException e) {
            throw new RuntimeException("Credenciales inválidas", e); // Puedes cambiar a una domain exception específica
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado tras auth"));

        // Generate Access Token
        String accessToken = jwtService.generateToken(user);

        // Setup new session
        UUID familyId = UUID.randomUUID();
        String tokenValue = UUID.randomUUID().toString();
        String currentTokenHash = jwtService.hashToken(tokenValue);

        // Return string is familyId:tokenValue
        String refreshTokenString = familyId.toString() + ":" + tokenValue;

        RefreshSession newSession = RefreshSession.builder()
                .user(user)
                .deviceId(deviceId != null && !deviceId.isEmpty() ? deviceId : "unknown-device")
                .familyId(familyId)
                .currentTokenHash(currentTokenHash)
                .revoked(false)
                .sessionVersion(user.getSessionVersion())
                .build();

        refreshSessionRepository.save(newSession);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenString)
                .familyId(familyId.toString())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Transactional
    public AuthResponse refresh(String refreshTokenString) {
        if (refreshTokenString == null || !refreshTokenString.contains(":")) {
            throw new TokenRefreshException("Refresh token no proporcionado o formato inválido");
        }

        String[] parts = refreshTokenString.split(":");
        UUID familyId = UUID.fromString(parts[0]);
        String tokenValue = parts[1];

        RefreshSession session = refreshSessionRepository.findByFamilyId(familyId)
                .orElseThrow(() -> new TokenRefreshException("Sesión no encontrada"));

        String tokenHash = jwtService.hashToken(tokenValue);

        // REUSE DETECTION ALARM
        if (!session.getCurrentTokenHash().equals(tokenHash)) {
            // Posible robo de token. Revocar toda la familia.
            session.setRevoked(true);
            refreshSessionRepository.save(session);
            throw new TokenRefreshException("ALERTA: Intento de reuso de un token revocado. Sesión terminada.");
        }

        if (session.getRevoked()) {
            throw new TokenRefreshException("La sesión ha sido revocada");
        }

        if (!session.getSessionVersion().equals(session.getUser().getSessionVersion())) {
            session.setRevoked(true);
            refreshSessionRepository.save(session);
            throw new TokenRefreshException("La sesión global ha expirado");
        }

        // Validation OK - Rotate Token
        String newTokenValue = UUID.randomUUID().toString();
        String newHash = jwtService.hashToken(newTokenValue);
        session.setCurrentTokenHash(newHash);
        refreshSessionRepository.save(session);

        String newAccessToken = jwtService.generateToken(session.getUser());
        String newRefreshTokenString = familyId.toString() + ":" + newTokenValue;

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshTokenString)
                .familyId(familyId.toString())
                .username(session.getUser().getUsername())
                .email(session.getUser().getEmail())
                .role(session.getUser().getRole().name())
                .build();
    }

    @Transactional
    public void logout(String familyIdStr) {
        if (familyIdStr != null && !familyIdStr.isEmpty()) {
            refreshSessionRepository.revokeByFamilyId(UUID.fromString(familyIdStr));
        }
    }

    @Transactional
    public void logoutAll(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setSessionVersion(user.getSessionVersion() + 1);
        userRepository.save(user);
    }
}
