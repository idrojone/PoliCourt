package com.policourt.api.courtsport.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CREATE TABLE court_sports (
 * id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 * court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
 * sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
 * UNIQUE (court_id, sport_id)
 * );
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourtSport {

    private Long id;
    private Long courtId;
    private Long sportId;
}
