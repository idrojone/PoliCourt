package com.policourt.api.sport.infrastructure.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.policourt.api.shared.enums.GeneralStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CREATE TABLE sports (
 * id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 * slug VARCHAR(100) NOT NULL UNIQUE,
 * name VARCHAR(100) NOT NULL UNIQUE,
 * description TEXT,
 * img_url TEXT,
 * status general_status DEFAULT 'PUBLISHED' NOT NULL,
 * is_active BOOLEAN DEFAULT TRUE,
 * created_at TIMESTAMPTZ DEFAULT NOW(),
 * updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

@Entity
@Table(name = "sports")
@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SportEntity {
    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "slug", nullable = false, unique = true, length = 100)
    private String slug;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "img_url", columnDefinition = "TEXT")
    private String imgUrl;

    @Column(name = "status", nullable = false, columnDefinition = "general_status")
    @Enumerated(EnumType.STRING)
    private GeneralStatus status;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
