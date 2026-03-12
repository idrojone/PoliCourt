package com.policourt.api.maintenance.infrastructure.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.policourt.api.court.infrastructure.entity.CourtEntity;
import com.policourt.api.maintenance.domain.enums.MaintenanceStatusEnum;
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
 * CREATE TABLE court_maintenances (
 * id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 * uuid UUID UNIQUE NOT NULL,
 * court_id BIGINT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
 * created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 * title VARCHAR(150) NOT NULL,
 * description TEXT,
 * start_time TIMESTAMPTZ NOT NULL,
 * end_time TIMESTAMPTZ NOT NULL,
 * status maintenance_status_enum DEFAULT 'SCHEDULED' NOT NULL,
 * is_active BOOLEAN DEFAULT TRUE,
 * created_at TIMESTAMPTZ DEFAULT NOW(),
 * updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */
@Entity
@Table(name = "court_maintenances")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourtMaintenanceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "uuid", nullable = false, unique = true)
    private UUID uuid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "court_id", nullable = false)
    private CourtEntity court;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private UserEntity createdBy;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_time", nullable = false)
    private OffsetDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private OffsetDateTime endTime;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MaintenanceStatusEnum status = MaintenanceStatusEnum.SCHEDULED;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
