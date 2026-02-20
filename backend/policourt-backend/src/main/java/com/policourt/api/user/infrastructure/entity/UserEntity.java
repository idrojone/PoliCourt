package com.policourt.api.user.infrastructure.entity;

import java.sql.Date;
import java.time.OffsetDateTime;

import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.policourt.api.booking.infrastructure.entity.BookingEntity;
import com.policourt.api.bookingattendee.infrastructure.entity.BookingAttendeeEntity;
import com.policourt.api.clubmember.infrastructure.entity.ClubMemberEntity;
import com.policourt.api.maintenance.infrastructure.entity.CourtMaintenanceEntity;
import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.user.domain.enums.UserRole;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CREATE TABLE users (
 * id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 * username VARCHAR(50) UNIQUE,
 * email VARCHAR(255) NOT NULL UNIQUE,
 * password_hash VARCHAR(255) NOT NULL,
 * first_name VARCHAR(100) NOT NULL,
 * last_name VARCHAR(100) NOT NULL,
 * phone VARCHAR(20),
 * date_of_birth DATE,
 * gender VARCHAR(20),
 * avatar_url TEXT,
 * role user_role NOT NULL DEFAULT 'USER',
 * status general_status DEFAULT 'PUBLISHED' NOT NULL,
 * is_active BOOLEAN DEFAULT TRUE,
 * is_email_verified BOOLEAN DEFAULT FALSE,
 * last_login_at TIMESTAMPTZ,
 * created_at TIMESTAMPTZ DEFAULT NOW(),
 * updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", length = 50, unique = true)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UserRole role = UserRole.USER;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GeneralStatus status = GeneralStatus.PUBLISHED;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "is_email_verified", nullable = false)
    @Builder.Default
    private Boolean isEmailVerified = false;

    @Column(name = "last_login_at")
    private OffsetDateTime lastLoginAt;

    @Column(name = "session_version", nullable = false)
    @Builder.Default
    private Integer sessionVersion = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "organizer", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<BookingEntity> bookings = new HashSet<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ClubMemberEntity> clubMemberships = new HashSet<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<BookingAttendeeEntity> bookingAttendances = new HashSet<>();

    @OneToMany(mappedBy = "createdBy", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<CourtMaintenanceEntity> createdMaintenances = new HashSet<>();
}
