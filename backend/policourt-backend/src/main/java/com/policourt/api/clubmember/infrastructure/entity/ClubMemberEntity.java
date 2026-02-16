package com.policourt.api.clubmember.infrastructure.entity;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.policourt.api.club.infrastructure.entity.ClubEntity;
import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.user.infrastructure.entity.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CREATE TABLE club_members (
 * id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 * club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
 * user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 * role VARCHAR(50) NOT NULL DEFAULT 'MEMBER', -- ADMIN, COACH, MEMBER
 * status general_status DEFAULT 'PUBLISHED' NOT NULL,
 * is_active BOOLEAN DEFAULT TRUE,
 * joined_at TIMESTAMPTZ DEFAULT NOW(),
 * updated_at TIMESTAMPTZ DEFAULT NOW(),
 * UNIQUE (club_id, user_id)
 * );
 */
@Entity
@Table(name = "club_members")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubMemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    private ClubEntity club;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "role", nullable = false, length = 50)
    @Builder.Default
    private String role = "MEMBER";

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GeneralStatus status = GeneralStatus.PUBLISHED;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private OffsetDateTime joinedAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
