package com.policourt.springboot.sport.infrastructure.mapper;

import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.infrastructure.entity.SportEntity;
import org.springframework.stereotype.Component;

/**
 * Componente de infraestructura encargado de mapear entre la entidad de persistencia {@link SportEntity}
 * y el modelo de dominio {@link Sport}.
 * Realiza la conversión de tipos necesaria, especialmente para fechas (Instant <-> OffsetDateTime).
 */
@Component
public class SportMapper {

    /**
     * Convierte una entidad JPA {@link SportEntity} a un modelo de dominio {@link Sport}.
     * Maneja la conversión de fechas de Instant (JPA) a OffsetDateTime (Dominio).
     *
     * @param entity La entidad de base de datos.
     * @return El objeto de dominio correspondiente o null si la entrada es null.
     */
    public Sport toDomain(SportEntity entity) {
        if (entity == null) return null;

        return Sport.builder()
            .id(entity.getId())
            .slug(entity.getSlug())
            .name(entity.getName())
            .description(entity.getDescription())
            .imgUrl(entity.getImgUrl())
            .status(entity.getStatus())
            .isActive(entity.getIsActive())
            .createdAt(
                entity.getCreatedAt() != null
                    ? entity.getCreatedAt().atOffset(java.time.ZoneOffset.UTC)
                    : null
            )
            .updatedAt(
                entity.getUpdatedAt() != null
                    ? entity.getUpdatedAt().atOffset(java.time.ZoneOffset.UTC)
                    : null
            )
            .build();
    }

    /**
     * Convierte un modelo de dominio {@link Sport} a una entidad JPA {@link SportEntity}.
     * Se utiliza para persistir los cambios en la base de datos.
     *
     * @param domain El objeto de dominio.
     * @return La entidad JPA lista para ser guardada o null si la entrada es null.
     */
    public SportEntity toEntity(Sport domain) {
        if (domain == null) return null;

        return SportEntity.builder()
            .id(domain.getId())
            .slug(domain.getSlug())
            .name(domain.getName())
            .description(domain.getDescription())
            .imgUrl(domain.getImgUrl())
            .status(domain.getStatus())
            .isActive(domain.isActive())
            .build();
    }
}
