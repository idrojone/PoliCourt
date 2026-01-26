package com.policourt.springboot.auth.domain.model;

import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.domain.enums.UserStatus;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class User {

    private UUID id;
    private String username;
    private String email;
    private String passwordHash;
    private String firstName;
    private String lastName;
    private String phone;
    private String imgUrl;
    private UserRole role;
    private UserStatus status;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
