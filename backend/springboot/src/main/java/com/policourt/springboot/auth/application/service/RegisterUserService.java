package com.policourt.springboot.auth.application.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.policourt.springboot.auth.application.dto.RegisterUserRequest;
import com.policourt.springboot.auth.application.dto.RegisterUserResponse;
import com.policourt.springboot.auth.domain.entity.User;
import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.domain.exception.UserAlreadyExistsException;
import com.policourt.springboot.auth.infrastructure.repository.UserRespository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RegisterUserService {
    private final UserRespository userRespository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public RegisterUserResponse register(RegisterUserRequest request) {
        
        if (userRespository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Usuario con email " + request.getEmail() + " ya existe.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.PLAYER)
                .isActive(true)
                .build();

        User savedUser = userRespository.save(user);

        // TODO: enviar email de confirmacion
        // TODO: Send welcome email

        return mapToRegisterUserResponse(savedUser);

        
    }

    private RegisterUserResponse mapToRegisterUserResponse(User user) {
        return RegisterUserResponse.builder()
            .message("Usuario registrado exitosamente")
            .build();
    }
}   
