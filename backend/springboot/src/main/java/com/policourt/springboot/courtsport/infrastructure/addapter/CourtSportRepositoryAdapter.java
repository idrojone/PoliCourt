package com.policourt.springboot.courtsport.infrastructure.addapter;

import com.policourt.springboot.courtsport.domain.model.CourtSport;
import com.policourt.springboot.courtsport.domain.repository.CourtSportRepository;
import com.policourt.springboot.courtsport.infrastructure.entity.CourtSportEntity;
import com.policourt.springboot.courtsport.infrastructure.mapper.CourtSportMapper;
import com.policourt.springboot.courtsport.infrastructure.repository.CourtSportJpaRepository;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
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
    public List<CourtSport> findAllByCourtId(UUID courtId) {
        return courtSportJpaRepository
            .findAllByCourtId(courtId)
            .stream()
            .map(courtSportMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public void deleteAllByCourtId(UUID courtId) {
        courtSportJpaRepository.deleteAllByCourtId(courtId);
    }

    @Override
    public void deleteAllByCourtIdAndSportSlugIn(
        UUID courtId,
        Set<String> slugs
    ) {
        courtSportJpaRepository.deleteAllByCourtIdAndSportSlugIn(
            courtId,
            slugs
        );
    }
}
