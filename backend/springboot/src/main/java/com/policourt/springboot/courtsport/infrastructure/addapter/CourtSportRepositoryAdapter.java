package com.policourt.springboot.courtsport.infrastructure.addapter;

import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.court.infrastructure.mapper.CourtMapper;
import com.policourt.springboot.courtsport.domain.model.CourtSport;
import com.policourt.springboot.courtsport.domain.repository.CourtSportRepository;
import com.policourt.springboot.courtsport.infrastructure.entity.CourtSportEntity;
import com.policourt.springboot.courtsport.infrastructure.mapper.CourtSportMapper;
import com.policourt.springboot.courtsport.infrastructure.repository.CourtSportJpaRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Adaptador de infraestructura que implementa el contrato del repositorio de CourtSport.
 * Se encarga de la comunicación con la base de datos a través de JPA y la conversión entre
 * entidades de persistencia y modelos de dominio.
 */
@Component
@RequiredArgsConstructor
public class CourtSportRepositoryAdapter implements CourtSportRepository {

    private final CourtSportJpaRepository courtSportJpaRepository;
    private final CourtSportMapper courtSportMapper;
    private final CourtMapper courtMapper;

    /**
     * Persiste la asociación entre una pista y un deporte.
     * Convierte el modelo de dominio a una entidad JPA, delega el guardado al repositorio y mapea el resultado de vuelta al dominio.
     *
     * @param courtSport El modelo de dominio a guardar.
     * @return El modelo de dominio guardado y actualizado.
     */
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

    /**
     * Recupera todas las asociaciones de deportes para una pista específica.
     * Realiza la conversión necesaria de la pista de dominio a entidad para filtrar en la base de datos.
     *
     * @param court La pista de la cual se quieren obtener los deportes asociados.
     * @return Lista de modelos de dominio {@link CourtSport} encontrados.
     */
    @Override
    public List<CourtSport> findByCourt(Court court) {
        var courtEntity = courtMapper.toEntity(court);
        return courtSportJpaRepository
            .findByCourt(courtEntity)
            .stream()
            .map(courtSportMapper::toDomain)
            .collect(Collectors.toList());
    }

    /**
     * Elimina la asociación especificada de la base de datos.
     * Convierte el modelo de dominio a entidad para ejecutar el borrado físico.
     *
     * @param courtSport El modelo de dominio a eliminar.
     */
    @Override
    public void delete(CourtSport courtSport) {
        var entity = courtSportMapper.toEntity(courtSport);
        courtSportJpaRepository.delete(entity);
    }
}
