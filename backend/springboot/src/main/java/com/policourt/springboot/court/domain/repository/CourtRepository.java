package com.policourt.springboot.court.domain.repository;

import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.enums.CourtSurface;
import com.policourt.springboot.court.domain.model.Court;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Contrato del repositorio para la gestión de pistas deportivas en la capa de dominio.
 */
public interface CourtRepository {
    /**
     * Guarda una pista deportiva en el sistema.
     *
     * @param court El objeto de dominio a persistir.
     * @return La pista guardada con sus metadatos actualizados.
     */
    Court save(Court court);

    /**
     * Busca una pista por su identificador único (UUID).
     *
     * @param id El UUID de la pista.
     * @return Un Optional que contiene la pista si se encuentra.
     */
    Optional<Court> findById(UUID id);

    /**
     * Recupera todas las pistas registradas en el sistema.
     *
     * @return Una lista con todas las pistas.
     */
    List<Court> findAll();

    /**
     * Elimina una pista del sistema por su ID.
     *
     * @param id El UUID de la pista a eliminar.
     */
    void deleteById(UUID id);

    /**
     * Elimina una pista específica del sistema.
     *
     * @param court El objeto de dominio de la pista a eliminar.
     */
    void delete(Court court);

    /**
     * Comprueba si ya existe una pista con el slug proporcionado.
     *
     * @param slug El identificador amigable a verificar.
     * @return true si el slug ya está en uso, false en caso contrario.
     */
    boolean existsBySlug(String slug);

    /**
     * Busca una pista por su identificador amigable (slug).
     *
     * @param slug El slug de la pista.
     * @return Un Optional que contiene la pista si se encuentra.
     */
    Optional<Court> findBySlug(String slug);

    /**
     * Búsqueda paginada y filtrada personalizada (implementada por el adaptador).
     *
     * @param q Texto de búsqueda (por name y locationDetails)
     * @param name nombre exacto/like
     * @param locationDetails ubicación (like)
     * @param price_h precio máximo
     * @param capacity capacidad mínima
     * @param isIndoor filtro de interioridad
     * @param surface filtro de superficie
     * @param status filtro de estado
     * @param isActive filtro activo
     * @param pageable paginación y orden
     * @return Página de {@link Court}
     */
    Page<Court> findAllByFilters(String q, String name, String locationDetails, BigDecimal priceMin, BigDecimal priceMax, Integer capacityMin, Integer capacityMax, Boolean isIndoor, java.util.Collection<CourtSurface> surfaces, Collection<CourtStatus> statuses, Collection<String> sports, Boolean isActive, Pageable pageable);
}
