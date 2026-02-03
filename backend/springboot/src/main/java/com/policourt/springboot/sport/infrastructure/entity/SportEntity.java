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
 * Entidad JPA que representa un deporte en la base de datos.
 * Mapea la tabla 'sports' y gestiona la información básica de cada disciplina deportiva.
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

    /** Identificador único del deporte (UUID). */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    @JdbcTypeCode(SqlTypes.UUID)
    @NotNull
    private UUID id;

    /** Identificador amigable para URLs (ej. "tenis-dobles"). Debe ser único. */
    @Column(name = "slug", nullable = false, unique = true, length = 100)
    private String slug;

    /** Nombre del deporte. Debe ser único. */
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    /** Descripción detallada del deporte. */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /** URL de la imagen representativa del deporte. */
    @Column(name = "img_url", columnDefinition = "TEXT")
    private String imgUrl;

    /** Relación One-to-Many con las asignaciones de pistas (CourtSport). */
    @OneToMany(
        mappedBy = "sport",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @Builder.Default
    private List<CourtSportEntity> courtAssignments = new ArrayList<>();

    /** Estado de publicación del deporte (PUBLISHED, DRAFT, etc.). */
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

    /** Indicador de borrado lógico. */
    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    /** Fecha de creación del registro (auditoría). */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /** Fecha de última modificación (auditoría). */
    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;
}
