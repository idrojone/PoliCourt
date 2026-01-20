package com.policourt.springboot.sport.domain.model;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.policourt.springboot.sport.domain.model.SportStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Modelo de dominio que representa un deporte.
 * 
 * @author Jordi Valls 
 * @version 1.0.0
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Sport {
    private UUID id;
    private String slug;
    private String name;
    private String description;
    private String imgUrl;
    private SportStatus status;
    private boolean isActive;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}