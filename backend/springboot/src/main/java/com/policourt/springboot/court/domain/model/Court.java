package com.policourt.springboot.court.domain.model;

import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.enums.CourtSurface;
import com.policourt.springboot.courtsport.domain.model.CourtSport;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
/**
 * Modelo de dominio que representa una pista deportiva.
 * Contiene la información técnica, de ubicación y estado de disponibilidad de la instalación.
 */
public class Court {

    /** Identificador único de la pista (UUID). */
    private UUID id;
    /** Identificador amigable para URLs. */
    private String slug;
    /** Nombre descriptivo de la pista. */
    private String name;
    /** Detalles específicos de la ubicación dentro del polideportivo. */
    private String locationDetails;
    /** URL de la imagen representativa de la pista. */
    private String imgUrl;
    /** Precio de alquiler por hora. */
    private BigDecimal priceH;
    /** Capacidad máxima de jugadores permitida. */
    private Integer capacity;
    /** Indica si la pista es cubierta (indoor) o al aire libre. */
    private Boolean isIndoor;
    /** Tipo de superficie de la pista (césped, cemento, etc.). */
    private CourtSurface surface;

    /** Estado de publicación de la pista. */
    @Builder.Default
    private CourtStatus status = CourtStatus.PUBLISHED;

    /** Indica si el registro está activo (borrado lógico). */
    @Builder.Default
    private boolean isActive = true;

    /** Lista de asociaciones entre esta pista y los deportes que se pueden practicar en ella. */
    private List<CourtSport> sportCourts;
    /** Fecha y hora de creación del registro. */
    private OffsetDateTime createdAt;
    /** Fecha y hora de la última actualización del registro. */
    private OffsetDateTime updatedAt;
}
