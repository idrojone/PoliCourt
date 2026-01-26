package com.policourt.springboot.courtsport.infrastructure.repository;

import com.policourt.springboot.courtsport.infrastructure.entity.CourtSportEntity;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourtSportJpaRepository
    extends JpaRepository<CourtSportEntity, UUID>
{
    List<CourtSportEntity> findAllByCourtId(UUID courtId);
    void deleteAllByCourtId(UUID courtId);
    void deleteAllByCourtIdAndSportSlugIn(UUID courtId, Set<String> slugs);
}
