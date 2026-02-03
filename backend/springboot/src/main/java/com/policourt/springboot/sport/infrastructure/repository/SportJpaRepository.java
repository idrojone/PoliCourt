package com.policourt.springboot.sport.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

import com.policourt.springboot.sport.infrastructure.entity.SportEntity;

/**
 * Repositorio JPA para la entidad {@link SportEntity}.
 * Extiende de {@link JpaRepository} para proporcionar operaciones CRUD estándar y consultas derivadas
 * contra la base de datos PostgreSQL.
 * 
 * @author Jordi Valls
 * @version 1.0.0
*/
public interface SportJpaRepository extends JpaRepository<SportEntity, UUID> {
    /**
     * Busca una entidad de deporte por su slug (identificador amigable y único).
     *
     * @param slug El slug a buscar.
     * @return Un {@link Optional} que contiene la entidad si se encuentra, o vacío si no.
     */
    Optional<SportEntity> findBySlug(String slug);

    /**
     * Verifica de forma optimizada si ya existe un deporte con el slug proporcionado.
     * Es más eficiente que hacer un `findBySlug().isPresent()`.
     *
     * @param slug El slug a verificar.
     * @return {@code true} si existe un deporte con ese slug, {@code false} en caso contrario.
     */
    boolean existsBySlug(String slug);

    /**
     * Verifica de forma optimizada si ya existe un deporte con el nombre proporcionado.
     *
     * @param name El nombre a verificar.
     * @return {@code true} si existe un deporte con ese nombre, {@code false} en caso contrario.
     */
    boolean existsByName(String name);
}
