package com.policourt.api.courtsport.infrastructure.entity;

import com.policourt.api.court.infrastructure.entity.CourtEntity;
import com.policourt.api.sport.infrastructure.entity.SportEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * CREATE TABLE court_sports (
 * id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 * court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
 * sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
 * UNIQUE (court_id, sport_id)
 * );
 */

@Entity
@Table(name = "court_sports")
@Getter
@Setter
public class CourtSportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "court_id")
    private CourtEntity court;

    @ManyToOne
    @JoinColumn(name = "sport_id")
    private SportEntity sport;
}
