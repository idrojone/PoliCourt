package com.policourt.springboot.courtsport.domain.repository;

import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.courtsport.domain.model.CourtSport;
import java.util.List;

/**
 * Contrato del repositorio para la relación entre pistas y deportes en la capa de dominio.
 */
public interface CourtSportRepository {

    /**
     * Guarda una nueva relación entre una pista y un deporte.
     *
     * @param courtSport El objeto de dominio a persistir.
     * @return La relación guardada.
     */
    CourtSport save(CourtSport courtSport);

    /**
     * Recupera todos los deportes asociados a una pista específica.
     *
     * @param court La pista para la cual buscar sus deportes.
     * @return Lista de relaciones CourtSport encontradas.
     */
    List<CourtSport> findByCourt(Court court);

    /**
     * Elimina una relación específica entre pista y deporte.
     *
     * @param courtSport La entidad de relación a eliminar.
     */
    void delete(CourtSport courtSport);
}
