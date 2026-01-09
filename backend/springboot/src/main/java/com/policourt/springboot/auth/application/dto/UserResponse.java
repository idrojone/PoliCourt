package com.policourt.springboot.auth.application.dto;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.domain.enums.UserStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private UUID id;
    private String email;
    private String username;
    private String fullName;
    private UserRole role;
    private UserStatus status;
    private Map<String, Object> profile;
    private LocalDateTime lastLogin;
    private Boolean isActive;
    private UUID clubId;
    private String clubName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
