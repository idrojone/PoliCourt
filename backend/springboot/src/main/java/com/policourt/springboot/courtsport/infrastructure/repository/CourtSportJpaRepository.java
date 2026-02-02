package com.policourt.springboot.courtsport.infrastructure.repository;

import com.policourt.springboot.court.infrastructure.entity.CourtEntity;
import com.policourt.springboot.courtsport.infrastructure.entity.CourtSportEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourtSportJpaRepository
    extends JpaRepository<CourtSportEntity, UUID>
{
    /**
     * Busca todas las relaciones de deportes asociadas a una pista específica.
     *
     * @param court La entidad de la pista.
     * @return Lista de entidades CourtSportEntity vinculadas a la pista.
     */
    List<CourtSportEntity> findByCourt(CourtEntity court);
}
