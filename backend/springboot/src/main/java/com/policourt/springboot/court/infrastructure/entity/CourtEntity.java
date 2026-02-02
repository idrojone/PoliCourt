package com.policourt.springboot.court.infrastructure.entity;

import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.enums.CourtSurface;
import com.policourt.springboot.courtsport.infrastructure.entity.CourtSportEntity;
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
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
// -- TABLA: COURTS (Pistas)

import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

// CREATE TABLE IF NOT EXISTS courts (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     name VARCHAR(100) NOT NULL,
//     location_details TEXT,
//     img_url TEXT,
//     price_h DECIMAL(10, 2) NOT NULL DEFAULT 0,

//     capacity INTEGER NOT NULL DEFAULT 4 CHECK (capacity > 0),
//     is_indoor BOOLEAN NOT NULL DEFAULT FALSE,
//     surface VARCHAR(50) NOT NULL DEFAULT 'HARD' CHECK (surface IN ('HARD','CLAY','GRASS','SYNTHETIC','WOOD','OTHER')),

// -- Auditoría
// status general_status DEFAULT 'PUBLISHED',
//     is_active BOOLEAN DEFAULT TRUE,
//     created_at TIMESTAMPTZ DEFAULT NOW(),
//     updated_at TIMESTAMPTZ DEFAULT NOW()
// );

/**
 * Entidad que representa una pista deportiva en la base de datos.
 * Almacena la configuración física, precio, capacidad y estado de disponibilidad de la pista.
 */
@Entity
@Table(name = "courts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class CourtEntity {

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

    @Column(name = "location_details", columnDefinition = "TEXT")
    private String locationDetails;

    @Column(name = "img_url", columnDefinition = "TEXT")
    private String imgUrl;

    @Column(name = "price_h", nullable = false)
    private BigDecimal priceH;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "is_indoor", nullable = false)
    private Boolean isIndoor;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "surface",
        nullable = false,
        columnDefinition = "court_surface_enum"
    )
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private CourtSurface surface;

    @OneToMany(
        mappedBy = "court",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private List<CourtSportEntity> sportAssignments = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        nullable = false,
        columnDefinition = "general_status"
    )
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @NotNull(message = "El status de la pista no puede ser nulo")
    @Builder.Default
    private CourtStatus status = CourtStatus.PUBLISHED;

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
