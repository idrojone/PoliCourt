package com.policourt.springboot.auth.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.policourt.springboot.auth.application.dto.GetCurrentUserResponse;
import com.policourt.springboot.auth.application.dto.UserResponse;
import com.policourt.springboot.auth.domain.entity.User;
import com.policourt.springboot.auth.domain.exception.InvalidTokenException;
import com.policourt.springboot.auth.domain.exception.UserNotFoundException;
import com.policourt.springboot.auth.infrastructure.repository.UserRespository;
import com.policourt.springboot.auth.infrastructure.security.JwtProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GetCurrentUserService {

    private final JwtProvider jwtProvider;
    private final UserRespository userRepository;

    @Transactional(readOnly = true)
    public GetCurrentUserResponse getCurrentUser(String token) {
        if (!jwtProvider.validateToken(token)) {
            log.error("Token inválido o expirado");
            throw new InvalidTokenException("Token inválido o expirado");
        }

        String username = jwtProvider.getUsernameFromToken(token);
        log.info("Obteniendo usuario actual: {}", username);

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> {
                    log.error("Usuario no encontrado: {}", username);
                    return new UserNotFoundException("Usuario no encontrado");
                });

        if (!user.getIsActive()) {
            log.error("Usuario inactivo: {}", username);
            throw new InvalidTokenException("Cuenta de usuario inactiva");
        }

        // Construir la respuesta
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .status(user.getStatus())
                .profile(user.getProfile())
                .lastLogin(user.getLastLogin())
                .isActive(user.getIsActive())
                .clubId(null)  // TODO: Implementar cuando se agregue la relación con Club
                .clubName(null)  // TODO: Implementar cuando se agregue la relación con Club
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();

        return GetCurrentUserResponse.builder()
                .user(userResponse)
                .build();
    }
}