package com.policourt.api.auth.presentation.mapper;

import com.policourt.api.auth.domain.model.RefreshSession;
import com.policourt.api.auth.presentation.request.RegisterRequest;
import com.policourt.api.auth.presentation.response.AuthResponse;
import com.policourt.api.auth.presentation.response.UserProfileResponse;
import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.user.domain.enums.UserRole;
import com.policourt.api.user.domain.model.User;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {


    public User toNewUser(RegisterRequest request, PasswordEncoder encoder) {
        String githubAvatarUrl = "https://github.com/identicons/" + request.getUsername() + ".png";

        return User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(encoder.encode(request.getPassword()))
                .avatarUrl(githubAvatarUrl)
                .role(UserRole.USER)
                .status(GeneralStatus.PUBLISHED)
                .isActive(true)
                .isEmailVerified(false)
                .sessionVersion(0)
                .build();
    }

    public RefreshSession toRefreshSession(User user, String deviceId, UUID familyId, String currentTokenHash) {
        return RefreshSession.builder()
                .user(user)
                .deviceId(deviceId)
                .familyId(familyId)
                .currentTokenHash(currentTokenHash)
                .revoked(false)
                .sessionVersion(user.getSessionVersion())
                .build();
    }

    public AuthResponse toAuthResponse(User user, String accessToken, String refreshTokenString, String familyId) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenString)
                .familyId(familyId)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public UserProfileResponse toUserProfile(User user) {
        return UserProfileResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}