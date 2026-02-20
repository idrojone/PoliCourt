package com.policourt.api.user.domain.model;

import java.sql.Date;
import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.user.domain.enums.UserRole;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String username;
    private String email;
    private String passwordHash;
    private String firstName;
    private String lastName;
    private String phone;
    private Date dateOfBirth;
    private String gender;
    private String avatarUrl;
    private UserRole role;
    private GeneralStatus status;
    private Boolean isActive;
    private Boolean isEmailVerified;
    private OffsetDateTime lastLoginAt;
    private Integer sessionVersion;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
