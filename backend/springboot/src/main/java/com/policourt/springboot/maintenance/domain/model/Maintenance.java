package com.policourt.springboot.maintenance.domain.model;

import com.policourt.springboot.auth.domain.model.User;
import com.policourt.springboot.court.domain.model.Court;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Modelo de dominio para el mantenimiento de pistas.
 * Representa un período donde la pista no está disponible para reservas.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Maintenance {

    private UUID id;
    private String slug;
    
    private Court court;
    private User createdBy;
    
    private String title;
    private String description;
    
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    
    @Builder.Default
    private MaintenanceStatus status = MaintenanceStatus.SCHEDULED;
    
    @Builder.Default
    private boolean isActive = true;
    
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
