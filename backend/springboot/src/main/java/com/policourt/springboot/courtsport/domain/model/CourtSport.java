package com.policourt.springboot.courtsport.domain.model;

import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.sport.domain.model.Sport;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Representa la relación entre una pista y un deporte específico.
 * Define qué deportes están disponibles en qué pistas.
 */
@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourtSport {

    private UUID id;
    private Sport sport;
    private Court court;
}
