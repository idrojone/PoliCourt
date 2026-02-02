package com.policourt.springboot.courtsport.infrastructure.entity;

import com.policourt.springboot.court.infrastructure.entity.CourtEntity;
import com.policourt.springboot.sport.infrastructure.entity.SportEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

/**
 * Entidad que representa la relación muchos a muchos entre pistas y deportes.
 * Define qué deportes se pueden practicar en una pista específica.
 */
@Entity
@Table(name = "court_sports")
@Getter
@Setter
public class CourtSportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "sport_id")
    private SportEntity sport;

    @ManyToOne
    @JoinColumn(name = "court_id")
    private CourtEntity court;
}
