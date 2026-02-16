package com.policourt.api.club.infrastructure.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.policourt.api.booking.infrastructure.entity.BookingEntity;
import com.policourt.api.clubmember.infrastructure.entity.ClubMemberEntity;
import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.sport.infrastructure.entity.SportEntity;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;

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

/**
 * CREATE TABLE clubs (
 * id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 * slug VARCHAR(100) NOT NULL UNIQUE,
 * name VARCHAR(100) NOT NULL UNIQUE,
 * description TEXT,
 * img_url TEXT,
 * sport_id BIGINT NOT NULL REFERENCES sports(id) ON DELETE RESTRICT,
 * status general_status DEFAULT 'PUBLISHED' NOT NULL,
 * is_active BOOLEAN DEFAULT TRUE,
 * created_at TIMESTAMPTZ DEFAULT NOW(),
 * updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */
@Entity
@Table(name = "clubs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slug", nullable = false, unique = true, length = 100)
    private String slug;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "img_url", columnDefinition = "TEXT")
    private String imgUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_id", nullable = false)
    private SportEntity sport;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private GeneralStatus status = GeneralStatus.PUBLISHED;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "club", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ClubMemberEntity> members = new HashSet<>();

    @OneToMany(mappedBy = "club", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<BookingEntity> bookings = new HashSet<>();
}
