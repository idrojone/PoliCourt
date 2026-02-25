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
import com.policourt.api.user.domain.model.User;
import com.policourt.api.user.domain.repository.UserRepository;

import com.policourt.api.auth.domain.exception.EmailAlreadyExistsException;
import com.policourt.api.auth.domain.exception.UsernameAlreadyExistsException;
import com.policourt.api.auth.presentation.mapper.AuthMapper;
import com.policourt.api.auth.domain.exception.AuthenticationFailedException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshSessionRepository refreshSessionRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final AuthMapper authMapper;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UsernameAlreadyExistsException(request.getUsername());
        }

        User newUser = authMapper.toNewUser(request, passwordEncoder);
        userRepository.save(newUser);
    }

    private String parseDeviceIdFromUserAgent(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return "unknown-device";
        }
        // crude parsing: take first token or identify common signatures
        String[] parts = userAgent.split("\\s");
        return parts.length > 0 ? parts[0] : userAgent;
    }

    @Transactional
    public AuthResponse login(LoginRequest request, String userAgentHeader) {
        String deviceId = parseDeviceIdFromUserAgent(userAgentHeader);

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (AuthenticationException e) {
            throw new AuthenticationFailedException("Credenciales inválidas", e);
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado tras auth"));

        // Generar access token
        String accessToken = jwtService.generateToken(user);

        // Nueva sessión
        UUID familyId = UUID.randomUUID();
        String tokenValue = UUID.randomUUID().toString();
        String currentTokenHash = jwtService.hashToken(tokenValue);

        // Retornar token con formato "familyId:tokenValue" para facilitar manejo en cookies y DB
        String refreshTokenString = familyId.toString() + ":" + tokenValue;

        RefreshSession newSession = authMapper.toRefreshSession(user, deviceId, familyId, currentTokenHash);
        refreshSessionRepository.save(newSession);

        return authMapper.toAuthResponse(user, accessToken, refreshTokenString, familyId.toString());
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
        return authMapper.toAuthResponse(session.getUser(), newAccessToken, newRefreshTokenString, familyId.toString());
    }

    @Transactional
    public void logout(String familyIdStr) {
        if (familyIdStr != null && !familyIdStr.isEmpty()) {
            refreshSessionRepository.revokeByFamilyId(UUID.fromString(familyIdStr));
        }
    }

    @Transactional
    public void logoutAll(Long userId) {
        refreshSessionRepository.revokeByUserId(userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        user.setSessionVersion(user.getSessionVersion() + 1);
        userRepository.save(user);
    }
}
