package com.policourt.springboot.auth.application.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import com.policourt.springboot.auth.application.dto.LoginUserRequest;
import com.policourt.springboot.auth.application.dto.LoginUserResponse;
import com.policourt.springboot.auth.application.dto.UserResponse;
import com.policourt.springboot.auth.domain.entity.User;
import com.policourt.springboot.auth.domain.exception.InvalidCredentialsException;
import com.policourt.springboot.auth.infrastructure.repository.UserRespository;
import com.policourt.springboot.auth.infrastructure.security.JwtProvider;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginUserService {

    private final UserRespository userRespository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider; 

    @Transactional
    public LoginUserResponse login(LoginUserRequest request) {
        User user = userRespository.findByEmailAndIsActiveTrue(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Credenciales inválidas");
        }

        List<String> roles = List.of(user.getRole().name());
        String accessToken = jwtProvider.generateToken(user.getEmail(), roles);
        String refreshToken = jwtProvider.generateRefreshToken(user.getEmail(), roles);

        user.recordLogin(); 
        userRespository.save(user);

        return LoginUserResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .role(user.getRole())
                        .status(user.getStatus())
                        .createdAt(user.getCreatedAt())
                        .build())
                .build();
    }
}
