package com.policourt.springboot.sport.infrastructure.entity;

import com.policourt.springboot.courtsport.infrastructure.entity.CourtSportEntity;
import com.policourt.springboot.sport.domain.model.SportStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * -- TABLA: SPORTS
 * CREATE TABLE IF NOT EXISTS sports (
 * id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 * slug VARCHAR(100) NOT NULL UNIQUE,
 * name VARCHAR(100) NOT NULL UNIQUE,
 * description TEXT,
 * img_url TEXT,
 *
 * -- Auditoría
 * status general_status DEFAULT 'PUBLISHED',
 * is_active BOOLEAN DEFAULT TRUE,
 * created_at TIMESTAMPTZ DEFAULT NOW(),
 * updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */

/**
 * Entidad que representa un deporte.
 * Mapea la table SPORTS en la base de datos.
 *
 * @author Jordi Valls
 * @version 1.0.0
 */
@Entity
@Table(name = "sports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class SportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    @JdbcTypeCode(SqlTypes.UUID)
    @NotNull
    private UUID id;

    @Column(name = "slug", nullable = false, unique = true, length = 100)
    private String slug;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "img_url", columnDefinition = "TEXT")
    private String imgUrl;

    @OneToMany(
        mappedBy = "sport",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private List<CourtSportEntity> courtAssignments = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        nullable = false,
        columnDefinition = "general_status"
    )
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @NotNull(message = "El status no puede ser nulo")
    @Builder.Default
    private SportStatus status = SportStatus.PUBLISHED;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;
}
