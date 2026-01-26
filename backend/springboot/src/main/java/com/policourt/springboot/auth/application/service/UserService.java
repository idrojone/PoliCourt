package com.policourt.springboot.auth.application.service;

import com.policourt.springboot.auth.application.mapper.UserDtoMapper;
import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.domain.enums.UserStatus;
import com.policourt.springboot.auth.domain.model.User;
import com.policourt.springboot.auth.domain.repository.UserRepository;
import com.policourt.springboot.auth.presentation.request.UserRequest;
import com.policourt.springboot.auth.presentation.response.UserResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserDtoMapper userDtoMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User register(UserRequest userRequest) {
        userRepository
            .findByUsername(userRequest.username())
            .ifPresent(u -> {
                throw new IllegalArgumentException(
                    "Username '" + userRequest.username() + "' already exists."
                );
            });
        userRepository
            .findByEmail(userRequest.email())
            .ifPresent(u -> {
                throw new IllegalArgumentException(
                    "Email '" + userRequest.email() + "' already exists."
                );
            });

        var user = userDtoMapper.toDomain(userRequest);

        user.setPasswordHash(passwordEncoder.encode(userRequest.password()));
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.PUBLISHED);
        user.setActive(true);
        user.setImgUrl(generateGravatarUrl(user.getEmail()));

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public java.util.List<UserResponse> findAll() {
        var users = userRepository.findAll();
        return userDtoMapper.toResponseList(users);
    }

    @Transactional(readOnly = true)
    public java.util.List<UserResponse> searchByUsername(String username) {
        var users = userRepository.searchByUsername(username);
        return userDtoMapper.toResponseList(users);
    }

    @Transactional
    public UserResponse updateUserRole(String username, UserRole role) {
        User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "User not found with username: " + username
                )
            );
        user.setRole(role);
        return userDtoMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUserStatus(String username, UserStatus status) {
        User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "User not found with username: " + username
                )
            );
        user.setStatus(status);
        return userDtoMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse toggleUserActive(String username) {
        User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "User not found with username: " + username
                )
            );
        user.setActive(!user.isActive());
        return userDtoMapper.toResponse(userRepository.save(user));
    }

    // Generar la URL de Gravatar basada en el email del usuario
    private static String generateGravatarUrl(String email) {
        var normalized = (email == null)
            ? ""
            : email.trim().toLowerCase(Locale.ROOT);
        var hash = md5Hex(normalized);
        return (
            "https://www.gravatar.com/avatar/" + hash + "?s=200&d=identicon&r=g"
        );
    }

    private static String md5Hex(String input) {
        try {
            var md = MessageDigest.getInstance("MD5");
            var digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("MD5 algorithm not available", e);
        }
    }
}
