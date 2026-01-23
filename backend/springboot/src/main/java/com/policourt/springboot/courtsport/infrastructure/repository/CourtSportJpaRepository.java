package com.policourt.springboot.courtsport.infrastructure.repository;

import com.policourt.springboot.courtsport.infrastructure.entity.CourtSportEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CourtSportJpaRepository
    extends JpaRepository<CourtSportEntity, UUID>
{
    @Modifying
    @Query("DELETE FROM CourtSportEntity cs WHERE cs.court.id = :courtId")
    void deleteAllByCourtId(UUID courtId);
}
