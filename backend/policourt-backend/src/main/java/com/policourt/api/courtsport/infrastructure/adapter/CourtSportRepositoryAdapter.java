package com.policourt.api.courtsport.infrastructure.adapter;

import com.policourt.api.courtsport.domain.model.CourtSport;
import com.policourt.api.courtsport.domain.repository.CourtSportRepository;
import com.policourt.api.courtsport.infrastructure.mapper.CourtSportMapper;
import com.policourt.api.courtsport.infrastructure.repository.CourtSportJpaRepository;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CourtSportRepositoryAdapter  implements CourtSportRepository{

    private final CourtSportJpaRepository courtSportJpaRepository;

    @Override
    public CourtSport save(CourtSport courtSport) {
        return CourtSportMapper.toDomain(courtSportJpaRepository.save(CourtSportMapper.toEntity(courtSport)));
    }

    @Override
    public boolean existsByCourtIdAndSportId(Long courtId, Long sportId) {
        return courtSportJpaRepository.existsByCourt_IdAndSport_Id(courtId, sportId);
    }
}
