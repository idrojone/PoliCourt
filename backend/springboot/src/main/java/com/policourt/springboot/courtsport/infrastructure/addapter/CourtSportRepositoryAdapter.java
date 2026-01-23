package com.policourt.springboot.courtsport.infrastructure.addapter;

import com.policourt.springboot.courtsport.domain.model.CourtSport;
import com.policourt.springboot.courtsport.domain.repository.CourtSportRepository;
import com.policourt.springboot.courtsport.infrastructure.entity.CourtSportEntity;
import com.policourt.springboot.courtsport.infrastructure.mapper.CourtSportMapper;
import com.policourt.springboot.courtsport.infrastructure.repository.CourtSportJpaRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CourtSportRepositoryAdapter implements CourtSportRepository {

    private final CourtSportJpaRepository courtSportJpaRepository;
    private final CourtSportMapper courtSportMapper;

    @Override
    public CourtSport save(CourtSport courtSport) {
        CourtSportEntity courtSportEntity = courtSportMapper.toEntity(
            courtSport
        );
        CourtSportEntity savedEntity = courtSportJpaRepository.save(
            courtSportEntity
        );
        return courtSportMapper.toDomain(savedEntity);
    }

    @Override
    public void deleteAllByCourtId(UUID courtId) {
        courtSportJpaRepository.deleteAllByCourtId(courtId);
    }
}
