package com.policourt.springboot.courtsport.domain.model;

import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.sport.domain.model.Sport;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourtSport {

    private UUID id;
    private Sport sport;
    private Court court;
}
